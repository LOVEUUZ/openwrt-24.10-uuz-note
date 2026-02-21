'use strict';
'require view';
'require uci';
'require form';
'require fs';

//L工具库模块
//bind
//resolveDefault


var fn = function () { console.log(this.x) };
var obj = { x: 100 };
var newFn = L.bind(fn, obj);    //L.bind 用法1
newFn();

var value = 0;

return view.extend({
	/* fs.exec执行后返回的结果
	root@OpenWrt:~# ubus call file exec '{"command":"/sbin/ip","params":["-4","neigh","show"]}'
	{
			"code": 0,
			"stdout": "10.0.0.5 dev eth0 lladdr 00:e2:69:65:79:0d ref 1 used 0/0/0 probes 1 DELAY\n192.168.1.166 dev br-lan lladdr 70:32:17:7a:f2:8d ref 1 used 0/0/0 probes 0 REACHABLE\n10.0.0.111 dev eth0 lladdr 78:df:72:f1:f1:22 ref 1 used 0/0/0 probes 1 REACHABLE\n10.0.0.1 dev eth0 lladdr 60:be:b4:11:4e:3b used 0/0/0 probes 1 STALE\n"
	}
	root@OpenWrt:~# ubus call file exec '{"command":"/sbin/ip","params":["-4","neigh","错误数据测试"]}'
	{
			"code": 1,
			"stderr": "ip: invalid argument '错误数据测试' to 'ip'\n"
	}
	*/
	load: function () {
		return Promise.all([
			L.resolveDefault(fs.exec('/sbin/ip', ['-4', 'neigh', 'show']), { stdout: '111' }),  //这个stdout是fs.exec固定的返回
			// fs.exec('/sbin/ip', ['-4', 'neigh', '错误数据测试']),        //这个就会执行不过,前端就会报错不会显示正确页面
			// fs.exec('/sbin/ip', ['-4', 'neigh', '错误数据测试']).catch(function (err) { return { stdout: '222' }; }),    //等价写法,一般用下面那个,毕竟是luci封装的
			L.resolveDefault(fs.exec('/sbin/ip', ['-4', 'neigh', '错误数据测试']), { stdout: '222' }),
		]);
	},

	//这个函数也可以卸载view外部,但那样就不能直接获取view的相关状态了,看情况使用
	myFunc: function () {
		console.log('this 是 view 对象, value = ' + value++);
	},

	render: function (data) {
		return E('测试按钮组', { style: 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding-top: 15px;' }, [
			E('button', { 'click': L.bind(this.myFunc, this) }, 'view内部绑定'),    //L.bind 用法2， 这里将函数和view对象绑定在一起, 这样就可以在函数内部直接访问view的状态了, 不需要担心this指向问题了
			E('button', { 'click': newFn }, '绑定外部函数'),            // L.bind 用法3
			E('button', { 'click': function () { console.log(data[0].stdout); }, }, 'resolveDefault成功测试'),
			E('button', { 'click': function () { console.log(data[1].stdout); }, }, 'resolveDefault失败测试'),
		]);
	}
});

