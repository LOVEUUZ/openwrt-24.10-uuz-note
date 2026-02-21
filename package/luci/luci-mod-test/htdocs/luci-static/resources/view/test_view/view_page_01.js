'use strict';
'require view';
'require dom';
'require ui';
'require form';
'require rpc';

var data = {
	value_01: {
		lan_ip: "",
		tmp_value: ""
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
			console.log("res ==> " + res);
			data.value_01.lan_ip = res['ipv4-address'][0].address;
			return res['ipv4-address'][0].address;
		});
	},

	render: function (lanIP) {

		// data.value_01.lan_ip = lanIP;

		var m = new form.JSONMap(data, "data", "");

		var s = m.section(form.TypedSection, 'value_01', _('System Info'));
		s.anonymous = true;

		var o = s.option(form.DummyValue, 'lan_ip', 'LAN IP');
		o.textvalue = function () {
			return lanIP;  // return data.value_01.lan_ip 或 o.textvalue = lanIP 写法都行
		};

		o = s.option(form.Value, 'tmp_value', 'onchage测试');
		//当失去焦点并且值改变过触发,第一个参数应该是dom相关的，第二个参数是绑定的对象，第三个参数是新值
		o.onchange = function (CustomEvent, section_id, value) {
			console.log("CustomEvent:", CustomEvent);
			console.log("section_id:", section_id);
			console.log("value:", value);
		};


		return m.render();
	},

});
