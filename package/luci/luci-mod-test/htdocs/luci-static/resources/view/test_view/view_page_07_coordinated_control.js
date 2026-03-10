'use strict';
'require view';
'require form';

var data = {
    value_0: {
        a: '0',
        b: '0',
        c: '0',
        d: '0',
        e: '0'
    }
};


return view.extend({

    // 用法1，通过 onchange 中遍历其他元素来修改dom实现
    render: function() {

        var m, s;
        var a, b, c, d, e;

        m = new form.JSONMap(data, 'Linkage Demo');

        s = m.section(form.TypedSection, 'value_0');
        s.anonymous = true;
        s.addremove = false;

        /* A 主控制 */
        a = s.option(form.Flag, 'a', 'Option A (Control)');

        /* 勾选联动 */
        b = s.option(form.Flag, 'b', 'Option B');
        c = s.option(form.Flag, 'c', 'Option C');

        /* 不可编辑联动 */
        d = s.option(form.Value, 'd', 'Option D (Disable Demo)');
        // d.readonly = true;

        /* 显示控制 */
        e = s.option(form.Flag, 'e', 'Option E (Visibility Demo)');

        /*
            depends
            不能跨 section
            能叠加使用构成 或/与 等条件

            进阶用法: proto = static 且 ipv6 = 1 才显示 ipv6_gateway
            gw.depends(function(sid) {
                var proto = this.map.formvalue(sid, 'proto');  //实时联动一定要用formvalue，因为map.data.get是uci值,formvalue才是ui值
                var ipv6  = this.map.formvalue(sid, 'ipv6');
                return proto == 'static' && ipv6 == '1';
            });

        */

        //也可以通过这控制隐藏显示,就不用下面那种方式了, 这个的语法是当 option_name(参数1) == expected_value(参数2) 的时候显示
        e.depends('a', '1');  

        // e.depends('b', '0');   //多个叠加使用，效果是 或( or, || )

        // 可以写json, 效果是 AND(&&),也能和上面 或 叠加使用     (a) || (b && c)
        // o.depends({
        //     proto: 'static',
        //     type: 'ipv4'
        // });
       

        /*
          ev    DOM 事件对象
          sid   当前 section 实例 ID
          value 当前 option 新值
        */
        a.onchange = function(ev, sid, value) {

            /* ---------- 1 勾选联动 ---------- */
            var list = ['b', 'c'];
            for (var i = 0; i < list.length; i++) {
                /* 
                  map.lookupOption(name, section_id)
                    name  要查找的 option 名称（即 UCI/JSON 字段名）
                    section_id	当前 section 实例 ID
                   返回 Array<Option>
                */
                var opt = this.map.lookupOption(list[i], sid);
                // var opt = m.lookupOption(list[i], sid);  一般推荐用上面那个,因为option中会有一个属性指向自己实际的map
                if (opt && opt.length) {
                    var ui = opt[0].getUIElement(sid);
                    if (ui)
                      ui.setValue(value);
                }
            }

            /* ---------- 2 禁用联动 (如果是单选框没有禁用样式)---------- */
            var optD = this.map.lookupOption('d', sid);
            if (optD && optD.length) {
                var uiD = optD[0].getUIElement(sid);
                if (uiD) {
                    var el = uiD.node.querySelector('input,select,textarea');
                    if (el)
                        el.disabled = (value == '1');
                }
            }

            /* ---------- 3 显示/隐藏联动 (简单控制用depends简单一些)---------- */
            //  uiE.node.style.display = 'none';    这个不能隐藏左侧文字,所以看情况用吧

            // var optD = this.map.lookupOption('d', sid);
            // if (optD && optD.length) {
            //    var uiD = optD[0].getUIElement(sid);   
            //    if (uiD && uiD.node) {
            //        var row = uiD.node.closest('.cbi-value');
            //        if (row)
            //            row.style.display = (value == '1') ? '' : 'none';
            //    }
            // }
                    
        };

        return m.render();
    }
});
