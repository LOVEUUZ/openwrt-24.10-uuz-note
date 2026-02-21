'use strict';
'require view';
'require uci';
'require form';
'require ui';

//ui UI增强模块

//showModal 页面弹窗
//addNotification 顶部通知

//showIndicator 右上角的绿色通知条，第一个参数是id,关闭的时候用hideIndicator传入这个id
//hideIndicator


/*
createHandlerFn

在 LuCI 前端里，事件回调通常涉及： 异步 RPC（Promise） 按钮重复点击 加载动画 异常捕获 自动错误提示
会自动帮你做：
✔ 绑定正确的 this
✔ 自动捕获异常
✔ 如果返回 Promise 自动等待
✔ 禁用按钮直到执行完成
✔ 统一错误提示
*/


return view.extend({

	//弹出提示框, 添加了些样式,可用做模板
	showTestModal: function (title, contentText) {
		ui.showModal(title, [

			E('div', {
				style: 'padding: 10px 0; min-width: 300px;'
			}, [
				E('h3', {
					style: 'margin: 0 0 10px 0; font-weight: 600;'
				}, contentText)
			]),

			E('div', {
				style: 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;'
			}, [

				E('button', {
					class: 'btn cbi-button cbi-button-neutral',
					click: function () {
						ui.hideModal();
					}
				}, '关闭'),

				E('button', {
					class: 'btn cbi-button cbi-button-apply',
					click: function () {
						ui.hideModal();
					}
				}, '确定')

			])
		]);
	},

	showTestNotificattion: function (contentText) {
		ui.addNotification('提示标题',
			E('p', {}, contentText),
			'warning'          //还有 info/warning/error
		);
	},

	showTndicator: function () {
		ui.showIndicator(1, '这个是showIndicator的内容');   //第一个参数是id
		setTimeout(() => {
			ui.hideIndicator(1);            //传入id关闭
		}, 2000);
	},

	createHandlerFn_btn: function (params) {
		console.log(params);
		this.showTestModal('标题', "modal正文");
	},

	render: function () {
		this.click_function = ui.createHandlerFn(this, function () {
			console.log('安全调用');
			this.showTestNotificattion('详细的的提示内容');
		});

		return E('测试按钮组', { style: 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding-top: 15px;' }, [
			E('button', { click: this.click_function }, "用法1"),
			E('button', { click: ui.createHandlerFn(this, this.createHandlerFn_btn, '用法2的参数') }, "用法2"),
			E('button', { click: this.showTndicator }, "加载状态")

		]);
	}
});

