import LoggedInName from "./LoggedInName";
import PageTitle from "./PageTitle";
import logouticon from "../assets/images/logouticon.png";

function Navbar() {
  function doLogout(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    localStorage.removeItem("user_data");
    window.location.href = "./";
  }

  return (
    <header id="header">
      {/* TITLE AND USER */}

      <div id="header-title">
        <PageTitle />
        <LoggedInName />
      </div>

      {/* NAVIGATION BAR */}

      <nav id="navbar">
        <ul>
          <li><a id="home-hyperlink">Home</a></li>
          <li><a id="web-hyperlink">Web</a></li>
          <li><a id="post-hyperlink">Post</a></li>
          <li><a id="message-hyperlink">Message</a></li>
          <li><a id="profile-hyperlink">Profile</a></li>
        </ul>
      </nav>

      {/* LOGOUT SECTION */}

      <div id="logout-container">
        <button id="logout-button" onClick={doLogout}>
          <img src={logouticon} alt="Logout Icon" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
