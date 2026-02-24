'use strict';
'require view';
'require dom';
'require uci';
'require ui';
'require form';
'require rpc';

var data = {
    info: {
        msg: '',
        number: 0
    }
};

//不带参数: ubus call myubus info
var get_myubus_info = rpc.declare({
    object: 'myubus',
    method: 'info',

    //非必须,主要用于映射,还很容易写错,但用来在前端的参数说明是很好用的
    expect: { 
        '': {      // 期望整个返回是一个对象
            msg: '',    // 包含 msg 字段，期望是字符串
            number: 0   // 包含 number 字段，期望是数字
          }
    },

  //二次处理,可选
  filter: function(res) {
    for (var k in res){
      console.log(k)  // msg 和 number 
      if(k == 'number') {
        res[k] = ++res[k];  //100+1
      }
    }
    return res;
  }
});

  //方法1: 单个函数调用
	// load: function() {
	// 	return get_myubus_info().then(function(res) {
  //    data.info = res;  //存到全局变量
	// 		return res;       //存到render的参数中
	// 	})
	// },


//带参数: ubus call myubus par.test '{"a":1,"b":"test"}' 不限制参数名和类型
var get_myubus_par_test = rpc.declare({
    object: 'myubus',
    method: 'par.test',
    params: ['a', 'b']
});

//带参数: ubus call myubus par2 '{"name":"uuz","age":18}' 参数名和类型必须和后端定义一致
var get_myubus_par2 = rpc.declare({
    object: 'myubus',
    method: 'par2',
    params: ['name', 'age'],
    expect: {
        '': {
          code: 0,
          data: {
            name: '',
            age: 0
          }
        }
        
    }
});



return view.extend({

  //方法2, 在render中用数组的形式访问返回值
	load: function() {
		return Promise.all([
      get_myubus_info(),  //返回值就直接是一个已经解析好的json对象，不用在 JSON.parse
      get_myubus_par_test('par1', 'par2'),  //同上
			get_myubus_par2("uuz", 17)
    ])
	},

	render: function(res) {
    data.info = res[0];

    console.log(res[1]);
    console.log(res[2]);
  
    var m = new form.JSONMap(data, 'myubus 内容');

    var s = m.section(form.NamedSection, 'info', '基本信息');
    // s.anonymous = true;

    var o1 = s.option(form.DummyValue, 'msg', 'msg');
    var o2 = s.option(form.DummyValue, 'number', 'number');

    return m.render();
	},
});

