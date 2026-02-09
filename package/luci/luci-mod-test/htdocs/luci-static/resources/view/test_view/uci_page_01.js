'use strict';
'require view';
'require form';
'require uci';

return view.extend({

    load: function () {
        return uci.load('system'); //uci show system
    },

    render: function () {

        var m = new form.Map('system', _('System'));

        var s = m.section(form.TypedSection, 'system');
        s.anonymous = true;

        var o = s.option(form.Value, 'hostname', _('Hostname'));

        return m.render();
    }
});
