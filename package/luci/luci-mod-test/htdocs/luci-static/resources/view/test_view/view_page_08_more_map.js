'use strict';
'require view';
'require form';

var data1 = {
    net: {
        ip: "192.168.1.1",
        mask: "255.255.255.0"
    }
};

var data2 = {
    sys: {
        hostname: "OpenWrt",
        timezone: "UTC"
    }
};

//是可以不用标签的, 因为用标签页只能自己手动写，很难与风格统一,这种用法估计也不多,留这里纪念一下
return view.extend({

    render: function() {
        /* ---------- Map1 ---------- */
        var m1 = new form.JSONMap(data1, "Network Settings");

        var s1 = m1.section(form.NamedSection, "net", "net");

        s1.option(form.Value, "ip", "IP Address");
        s1.option(form.Value, "mask", "Netmask");


        /* ---------- Map2 ---------- */
        var m2 = new form.JSONMap(data2, "System Settings");

        var s2 = m2.section(form.NamedSection, "sys", "sys");

        s2.option(form.Value, "hostname", "Hostname");
        s2.option(form.Value, "timezone", "Timezone");


        return Promise.all([
            m1.render(),
            m2.render()
        ]).then(function(res) {

            var tab1 = E('div', {
                'class': 'cbi-tabcontainer',
                id: 'tab-network'
            }, res[0]);

            var tab2 = E('div', {
                'class': 'cbi-tabcontainer',
                id: 'tab-system',
                style: 'display:none'
            }, res[1]);


            var btn1, btn2;

            function switchTab(id) {

                tab1.style.display = 'none';
                tab2.style.display = 'none';

                btn1.classList.remove('cbi-tab-active');
                btn2.classList.remove('cbi-tab-active');

                if (id === 'tab-network') {
                    tab1.style.display = '';
                    btn1.classList.add('cbi-tab-active');
                }
                else {
                    tab2.style.display = '';
                    btn2.classList.add('cbi-tab-active');
                }
            }


            /* ---------- Tab 菜单 ---------- */
            btn1 = E('button', {
                'class': 'cbi-tab cbi-tab-active',
                click: function() { switchTab('tab-network'); }
            }, 'Network');

            btn2 = E('button', {
                'class': 'cbi-tab',
                click: function() { switchTab('tab-system'); }
            }, 'System');


            return E('div', {}, [

                E('div', { 'class': 'cbi-tabmenu' }, [
                    btn1,
                    btn2
                ]),

                tab1,
                tab2
            ]);
        });
    }
});