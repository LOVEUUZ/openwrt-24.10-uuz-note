'use strict';
'require view';
'require uci';
'require form';

/*
config global 'settings'
    option enable '1'
    option mode 'advanced'

config profile
    option name 'profile1'
    option ip '10.0.0.1'
    list service 'http'
    list service 'ssh'

config profile
    option name 'profile2'
    option ip '10.0.0.2'
    list service 'dns'
*/

/*
root@OpenWrt:~# uci show myapp

myapp.settings=global
myapp.settings.enable='1'
myapp.settings.mode='advanced'
myapp.@profile[0]=profile
myapp.@profile[0].name='profile1'
myapp.@profile[0].ip='10.0.0.1'
myapp.@profile[0].service='http' 'ssh'
myapp.@profile[1]=profile
myapp.@profile[1].name='profile2'
myapp.@profile[1].ip='10.0.0.2'
myapp.@profile[1].service='dns'
*/


return view.extend({
    load: function() {
        return uci.load('myapp');
    },

    render: function() {
        var m,s,o;

        //form.Map 直接绑定uci内容, form.JSONMap 绑定的是 js 中的数据结构
        m = new form.Map('myapp', '这些是myapp相关内容');
        s = m.section(form.NamedSection, 'settings', 'setting内容');
        o = s.option(form.Flag, 'enable', 'enable属性');
        //如果不设置该属性, 那么取消勾选提交后就会删除该属性,这个时候后端判断的写法就需要:
        // [ -n "$(uci get xxx.enable 2>/dev/null)" ] && enable
        o.rmempty = false;   
        
        o = s.option(form.DummyValue, 'mode', 'mode属性');

        //效果图 https://raw.githubusercontent.com/LOVEUUZ/res/refs/heads/main/openwrt/openwrt%E8%87%AA%E5%AE%9A%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E6%95%B0%E7%BB%84%E5%9E%8B%E5%86%85%E5%AE%B9_TypedSection%20.png
        s = m.section(form.TypedSection , 'profile', 'profile列表');
        o = s.option(form.Value, 'name', 'name属性');
        o = s.option(form.Value, 'ip', 'ip属性');
        o = s.option(form.DynamicList, 'service', 'service项目');

        //效果图 https://raw.githubusercontent.com/LOVEUUZ/res/refs/heads/main/openwrt/openwrt%E8%87%AA%E5%AE%9A%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E6%95%B0%E7%BB%84%E5%9E%8B%E5%86%85%E5%AE%B9_GridSection.png
        s = m.section(form.GridSection , 'profile', 'profile列表');
        o = s.option(form.Value, 'name', 'name属性');
        o = s.option(form.Value, 'ip', 'ip属性');
        // o = s.option(form.DynamicList, 'service', 'service项目'); //GridSection不支持DynamicList

        //效果图 https://raw.githubusercontent.com/LOVEUUZ/res/refs/heads/main/openwrt/openwrt_%E6%95%B0%E7%BB%84%E5%9E%8B%E5%92%8Clist%E5%9E%8B%E5%86%85%E5%AE%B9%E7%BB%84%E5%90%88_TableSection.png
        s = m.section(form.TableSection , 'profile', 'profile列表');
        o = s.option(form.Value, 'name', 'name属性');
        o = s.option(form.Value, 'ip', 'ip属性');
        o = s.option(form.DynamicList, 'service', 'service项目');

        
        return m.render();
    }
});