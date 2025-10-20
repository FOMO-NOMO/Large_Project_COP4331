import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import CardUI from '../components/CardUI';
import Navbar from '../components/Navbar';

const CardPage = () =>
{
    return(
        <div id='container'>
            <Navbar/>
            <CardUI />
        </div>
    );
}

export default CardPage;
