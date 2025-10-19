import PageTitle from '../components/PageTitle';
import Login from '../components/Login';

const LoginPage = () =>
{

    return(
      <div id='login-page'>
        <div id='login-container'>
          <PageTitle />
          <Login />
        </div>
      </div>
    );
};

export default LoginPage;
