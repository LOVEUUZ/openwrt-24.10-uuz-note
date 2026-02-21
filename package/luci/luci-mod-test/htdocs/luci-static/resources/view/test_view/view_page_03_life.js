'use strict';
'require view';
'require uci';
'require form';

window.addEventListener('beforeunload', function () {
	console.log('页面即将离开');
});

return view.extend({

	load: function () {
		console.log('load函数被调用了');
		return uci.load('myapp');
	},

	render: function () {
		console.log('render函数被调用了');

		var m, s1, s2, o1, o2, o3;

		//form.Map 直接绑定uci内容, form.JSONMap 绑定的是 js 中的数据结构
		m.tabbed = true;
		m = new form.Map('myapp', '这些是myapp相关内容');
		

		s1 = m.section(form.NamedSection, 'settings', 'setting内容');
		o1 = s1.option(form.Flag, 'enable', 'enable属性');
		o2 = s1.option(form.Value, 'mode', 'mode属性');



		//实时值校验，可用
		o2.validate = function (section_id, value) {
			// console.log("section_id: " + section_id)		//settings
			// console.log("value: " + value)							//实时值

			if (value.length < 4) {
				return '必须大于4个字符';
			} else {
				return true;
			}
		}

		//全局提交后的处理(不可用，原因不清楚)
		m.onAfterSave = function () {
			console.log("onAfterSave");
		}


		//表单重复校验, 但是目前有缺陷, 比如重复的话没有提示, 只是添加操作无法触发,后续深入应该能优化
		s2 = m.section(form.TableSection, 'profile', 'profile列表');
		o3 = s2.option(form.Value, 'name', 'name属性');
		o3 = s2.option(form.Value, 'ip', 'ip属性');
		o3 = s2.option(form.DynamicList, 'service', 'service项目');
		//会对每一个 DynamicList 都会进行校验
		o3.validate = function (section_id, value) {
			// 只有在保存阶段才会收到数组,输入阶段都是单个的输入的值
			if (!Array.isArray(value))
				return true;

			var set = {};
			var i;

			for (i = 0; i < value.length; i++) {
				var v = value[i].trim();
				if (set[v]) {
					return '不允许重复项:' + v;
				}
				set[v] = true;
			}
			return true;
		}



		return m.render();
	},
	
	/*
		| 返回值                 | 含义   | 框架行为          |
		| ------------------- | ---- | ------------- |
		| `Promise.resolve()` | 成功完成 | 继续执行          |
		| `Promise.reject()`  | 执行失败 | 进入 catch，停止后续 |
		| `new Promise(...)`  | 异步操作 | 等待 resolve    |
		| `undefined`         | 立即成功 | 自动包装          |
		| `false`             | 无意义  | 旧版本可能报错       |
		| 抛异常               | 失败   | 进入 catch      |
	*/

	handleSave: function (ev) {
		console.log('handleSave');
		return Promise.reject();
	},

	handleApply: function (ev) {
		console.log('handleApply');
		return Promise.resolve();
	},

	handleReset: function (ev) {
		console.log('handleReset');
		return Promise.reject();
	},

});


