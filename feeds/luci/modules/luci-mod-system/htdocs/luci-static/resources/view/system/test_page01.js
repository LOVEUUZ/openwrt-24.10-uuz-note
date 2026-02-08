'use strict';
'require view';
'require dom';
'require ui';
'require form';
'require rpc';

var data = {
	value_01: {
		name: ""
	},
	value_02: {
		value_02_01: "",
		value_02_02: ""
	}
};

var getLanIP = rpc.declare({
	object: 'network.interface.lan',
	method: 'status',
	expect: { '': {} }
});

return view.extend({

	load: function () {
		return getLanIP().then(function (res) {
			return res['ipv4-address'][0].address;
		});
	},

	render: function (lanIP) {
		
		data.value_01.name = lanIP;

		var m = new form.JSONMap(data, "test_page_001", "这个应该是表单标题和下面内容的线之间的内容");

		var s, o;
		s = m.section(form.NamedSection, "value_01", null, "测试分组");
		o = s.option(form.Value, "name", "LAN IP");

		var s1, o1, o2;
		s1 = m.section(form.NamedSection, "value_02", null);
		o1 = s1.option(form.Value, "value_02_01", "value_02_01");
		o2 = s1.option(form.Value, "value_02_02", "value_02_02");

		return m.render();
	},

	handleSave: function () {
		ui.addNotification(null,
			E('p',
				'Hello 1 ' + data.value_01.name +
				"\n2: " + data.value_02.value_02_01
			)
		);
	}
});
