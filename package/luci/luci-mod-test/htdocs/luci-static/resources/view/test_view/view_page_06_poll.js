'use strict';
'require view';
'require poll';
'require form';

//这个要方便一些，毕竟原生DOM，但毕竟大部分情况用的还是form
// return view.extend({

//     render: function () {
//         var count = 0;

//         // 创建一个可更新的 DOM 节点
//         var counterNode = E('p', {}, '0');

//         poll.add(function () {
//             count++;
//             counterNode.textContent = count;
//         }, 1);   // 每秒执行

//         return E('div', {}, [
//             E('h3', {}, '秒数'),
//             counterNode
//         ]);
//     }

// });


var data = {
	section_01: {
		count: 0,
	}
};

return view.extend({

	render: function () {

		var m = new form.JSONMap(data, null, '');
		var s = m.section(form.NamedSection, 'section_01', '', '定时任务更新DOM');

		s.option(form.DummyValue, 'count', '秒数');

		return m.render().then(function (mapEl) {
			var count = 0;

			// 精确定位到当前 section 内的值显示区域
			var field = mapEl.querySelector(
				'[data-section-id="section_01"] .cbi-value-field'
			);

			poll.add(function () {
				count++;
				if (field)
					field.textContent = count;
			}, 1);

			return mapEl;
		});
	}
});