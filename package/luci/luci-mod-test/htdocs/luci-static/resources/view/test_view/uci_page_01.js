'use strict';
'require view';
'require uci';

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
        return uci.load('myapp'); //先load,才能get. uci.load必须在load函数中完成不能去render中
    },

    render: function() {
        //没有重名的直接取值
        var enable = uci.get('myapp', 'settings', 'enable');
        var mode   = uci.get('myapp', 'settings', 'mode');
        
        //数组形式的必须使用 sections 取出来
        var profiles = uci.sections('myapp', 'profile');
        console.log(profiles.length  )
        if(profiles.length > 0) {
          for(var i = 0; i < profiles.length  ; i++) {
            console.log(profiles[i].ip);
          }
        }

        //数组取出方式2
        var s = uci.sections('myapp', 'profile')[0];

        return E('div', {}, [
            E('p', {id: 'p1',}, 'Enable: ' + enable),
            E('p', {'data-mode': 3}, 'Mode: ' + mode),
          ]);
    }
});