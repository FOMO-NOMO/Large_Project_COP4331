import React from 'react';
import PageTitle from './PageTitle';

function SignUp(){
    function doCancel(){
        window.location.href="/";
    }

    return(
        <div id='login-page'>
            <div id='login-container'>
                <div id="loginDiv">
                    <form id='loginForm'>
                        <div id='login-input-group'>
                            <div>
                                <label id='firstname-label'>First Name</label>
                            </div>
                            <input type="text" id="login-input" placeholder="Enter First Name"/>
                        </div>
                        <div id='login-input-group'>
                            <div>
                                <label id='username-label'>Last Name</label>
                            </div>
                            <input type="text" id="login-input" placeholder="Enter Last Name"/>
                        </div>
                        <div id='login-input-group'>
                            <div>
                                <label id='username-label'>Username</label>
                            </div>
                            <input type="text" id="login-input" placeholder="Enter Username"/>
                        </div>
                        <div id='login-input-group'>
                            <div>
                                <label id='password-label'>Password</label>
                            </div>
                            <input type="password" id="password-input" placeholder="Enter Password" />
                        </div>
                        <div id='login-submit-container'>
                            <button type='submit' id='login-button' className='buttons'>Join Now</button>
                        </div>
                        <div id='sign-up-submit-container'>
                            <p id='sign-up-button' className='buttons' onClick={doCancel}>Cancel</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default SignUp;
