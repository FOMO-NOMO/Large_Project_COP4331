import React, { useState } from 'react';
import { buildPath } from './Path';
import { storeToken } from '../tokenStorage';
import { jwtDecode } from 'jwt-decode';
function Login() {
  const [message, setMessage] = useState('');
  const [loginName, setLoginName] = React.useState('');
  const [loginPassword, setPassword] = React.useState('');
  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    var obj = { login: loginName, password: loginPassword };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath('api/login'),
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
      var res = JSON.parse(await response.text());
      const { accessToken } = res;
      storeToken(res);
      const decoded = jwtDecode(accessToken) as any;
      try {
        var ud = decoded;
        var userId = ud.iat;
        var firstName = ud.firstName;
        var lastName = ud.lastName;
        if (userId <= 0) {
          setMessage('User/Password combination incorrect');
        }
        else {
          var user = { firstName: firstName, lastName: lastName, id: userId }
          localStorage.setItem('user_data', JSON.stringify(user));
          setMessage('');
          window.location.href = '/cards';
        }
      }
      catch (e) {
        console.log(e);
        return;
      }
    }
    catch (error: any) {
      alert(error.toString());
      return;
    }
  };
  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }
  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }
  return (
    <div id="loginDiv">
      <span id="inner-title">PLEASE LOG IN</span><br />
      Login: <input type="text" id="loginName" placeholder="Username"
        onChange={handleSetLoginName} /><br />
      Password: <input type="password" id="loginPassword" placeholder="Password"
        onChange={handleSetPassword} />
      <input type="submit" id="loginButton" className="buttons" value="Do It"
        onClick={doLogin} />
      <span id="loginResult">{message}</span>
    </div>
  );
};
export default Login;