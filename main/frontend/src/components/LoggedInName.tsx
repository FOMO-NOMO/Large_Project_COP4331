
function LoggedInName()
{
    function doLogout(event:any) : void
    {
        // clear user data and go back to login page
        event.preventDefault();
        localStorage.removeItem("user_data");

        window.location.href = './';
    };

    return(
      <div id="loggedInDiv">
        <span id="userName">Welcome John Doe </span><br />
                            <button type="button" id="logout-button" className="buttons" onClick={doLogout}> Log Out </button>

      </div>
    );
};

export default LoggedInName;
