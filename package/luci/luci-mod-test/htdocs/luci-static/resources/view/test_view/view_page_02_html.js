'use strict';
'require view';
'require dom';
'require ui';
'require form';


var test = {

};


return view.extend({

	render: function () {

		var msgNode = E('div', {
			style: 'text-align:center;margin-top:10px;color:red;'
		});

		var userInput = E('input', {
			type: 'text',
			placeholder: '用户名',
			style: 'width:100%;padding:8px;margin:8px 0;'
		});

		var passInput = E('input', {
			type: 'password',
			placeholder: '密码',
			style: 'width:100%;padding:8px;margin:8px 0;'
		});

		var loginBtn = E('button', {
			class: 'btn cbi-button cbi-button-apply',
			style: 'width:100%;padding:8px;',
			click: function () {

				var user = userInput.value;
				var pass = passInput.value;

				if (!user || !pass) {
					msgNode.style.color = 'red';
					msgNode.textContent = '用户名或密码不能为空';
					return;
				}

				if (user === 'admin' && pass === '1234') {
					msgNode.style.color = 'green';
					msgNode.textContent = '登录成功';
				} else {
					msgNode.style.color = 'red';
					msgNode.textContent = '账号或密码错误';
				}
			}
		}, '登录');

		return E('div', {
			class: 'cbi-section',
			style: 'width:320px;margin:120px auto;padding:20px;'
		}, [
			E('h2', { style: 'text-align:center;' }, '登录'),
			userInput,
			passInput,
			loginBtn,
			msgNode
		]);
	}

});

//原生 html和内嵌的写法
/* 
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Login</title>
<style>
body {
	font-family: Arial;
	background: #f5f5f5;
}
.login-box {
	width: 300px;
	margin: 120px auto;
	padding: 20px;
	background: white;
	border-radius: 6px;
	box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.login-box h2 {
	text-align: center;
}
.login-box input {
	width: 100%;
	padding: 8px;
	margin: 8px 0;
}
.login-box button {
	width: 100%;
	padding: 8px;
	background: #409eff;
	border: none;
	color: white;
	cursor: pointer;
}
.login-box button:hover {
	background: #66b1ff;
}
.msg {
	text-align: center;
	margin-top: 10px;
	color: red;
}
</style>
</head>

<body>

<div class="login-box">
	<h2>登录</h2>
	<input type="text" id="username" placeholder="用户名">
	<input type="password" id="password" placeholder="密码">
	<button onclick="login()">登录</button>
	<div class="msg" id="msg"></div>
</div>

<script>
function login() {
	var user = document.getElementById('username').value;
	var pass = document.getElementById('password').value;
	var msg  = document.getElementById('msg');

	if (!user || !pass) {
		msg.innerText = '用户名或密码不能为空';
		return;
	}

	if (user === 'admin' && pass === '1234') {
		msg.style.color = 'green';
		msg.innerText = '登录成功';
	} else {
		msg.style.color = 'red';
		msg.innerText = '账号或密码错误';
	}
}
</script>

</body>
</html>
*/