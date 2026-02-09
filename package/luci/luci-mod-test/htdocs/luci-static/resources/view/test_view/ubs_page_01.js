'use strict';
'require view';
'require dom';
'require ui';
'require form';
'require rpc';

var data = {
	value_01: {
		lan_ip: ""
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

	render: function(lanIP) {

    // data.value_01.lan_ip = lanIP;

	  var m = new form.JSONMap(data,"ubs_page_01","");

	  var s = m.section(form.TypedSection, 'value_01', _('System Info'));
    s.anonymous = true;

    var o = s.option(form.DummyValue, 'lan_ip', 'LAN IP');
    o.textvalue = function() {
      return lanIP;  // return data.value_01.lan_ip 或 o.textvalue = lanIP 写法都行
    };

	  return m.render();
	},

});
