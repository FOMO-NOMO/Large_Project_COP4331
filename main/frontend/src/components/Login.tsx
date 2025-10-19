import React, { useState } from 'react';

function Login()
{
  const [message,setMessage] = useState('');
  const [loginName,setLoginName] = React.useState('');
  const [loginPassword,setPassword] = React.useState('');

  async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();

        var obj = {login:loginName,password:loginPassword};
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch('http://localhost:5000/api/login',
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
      };


  function handleSetLoginName( e: any ) : void
  {
    setLoginName( e.target.value );
  };

  function handleSetPassword( e: any ) : void
  {
    setPassword( e.target.value );
  };


  return(
    <div id="loginDiv">
      <form id='loginForm'>
        <div id='login-error-container'>
          <span id="loginResult">{message}</span>
        </div>
        <div id='login-input-group'>
          <div>
            <label id='username-label'>Username</label>
          </div>
          <input type="text" id="login-input" placeholder="Username" onChange={handleSetLoginName} />
        </div>
        <div id='login-input-group'>
          <div>
            <label id='password-label'>Password</label>

          </div>
          <input type="password" id="password-input" placeholder="Password" onChange={handleSetPassword} />
        </div>
        <div id='login-submit-container'>
          <button type='submit' id='login-button' className='buttons' onClick={doLogin}>Login</button>
        </div>
      </form>
    </div>
  );
};
export default Login;
