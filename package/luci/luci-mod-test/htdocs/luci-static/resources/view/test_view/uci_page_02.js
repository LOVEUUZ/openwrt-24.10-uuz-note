'use strict';
'require view';
'require dom';
'require ui';
'require form';


var data = {
	value_01: {
		name: ""
	},
	value_02: {
		value_02_01: "",
		value_02_02: "",
		enabled: 0,
		protocol: "",
		dns_servers: [],
		custom_script: "",
		apply_btn: "a?"
	}
};


return view.extend({

	render: function(lanIP) {
	    // 假设 data 是前端需要渲染的 JSON 数据
	    data.value_01.name = lanIP;

	    // 创建一个 JSONMap 对象
	    // 参数：
	    // data         -> 绑定的数据源，通常是后端返回的 JSON
	    // "test_page_001" -> 页面 ID，唯一标识该表单页面
	    // "表单标题"       -> 页面标题显示在顶部，可带描述性文字
	    var m = new form.JSONMap(
	        data,
	        "test_page_001",
	        "这个应该是表单标题和下面内容的线之间的内容"
	    );

	    var s, o;

	    // =====================
	    // NamedSection 示例
	    // =====================
	    // NamedSection 参数：
	    // form.NamedSection -> Section 类型
	    // "value_01"        -> Section 名称，对应 JSON 或 UCI 的 section 名
	    // null              -> 如果有类型，可以填写类型名称，null 表示不指定
	    // "测试分组"        -> Section 的标题显示在前端
	    s = m.section(form.NamedSection, "value_01", null, "测试分组");

	    // Value 输入框示例
	    // 参数：
	    // form.Value  -> 组件类型
	    // "name"      -> 绑定字段名，对应 data.value_01.name
	    // "LAN IP"    -> 前端显示标题
	    o = s.option(form.Value, "name", "LAN IP");
	    o.datatype = "ip4addr";           // 字段类型，LuCI 内置
	    o.placeholder = "请输入 LAN IP";   // 输入框提示文字
	    o.rmempty = false;                // 是否允许为空
	    o.default = "0.0.0.0";         		// 默认值

	    // 最后渲染 Map 并返回 HTML
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
