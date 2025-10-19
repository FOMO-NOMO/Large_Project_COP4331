import LoggedInName from "./LoggedInName";
import PageTitle from "./PageTitle";

function Header(){


    return(
        <div id="header">
            <div id="header-title">
                <PageTitle/>
                <LoggedInName/>
            </div>
            <div id="navbar-container">
                <nav id="navbar">
                    <ul>
                        <li><a>Home</a></li>
                        <li><a>Web</a></li>
                        <li><a>Post</a></li>
                        <li><a>Message</a></li>
                        <li><a>Profile</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </nav>
            </div>

        </div>
    )
}


export default Header;
