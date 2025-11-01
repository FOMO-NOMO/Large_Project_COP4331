import { PostsAPI } from '../../api/posts';
import { AuthAPI } from '../../api/auth';

import { images} from '../../assets/images/images';

export default function Navbar(){

    // const { userId, title, description, tags, capacity } = req.body;
    const user = AuthAPI.getCurrentUser();


    const create = async () => {
        console.log("Creating...", user);

        const tempostData = {
            userId: Number(user?.id),
            title: "Testing post",
            description: "Whats good from Ameer",
            tags: ["frontend", "Ameer"],
            capacity: 25
        }

        const data = await PostsAPI.createPost(tempostData);
    }



    return(
        <div className='navbar-container'>
            <p className="app-title">FOMO NOMO</p>
            <nav>
                <div className='nav-button home'>
                    <img src={images.homeicon}/>
                    <p>Home</p>
                </div>
                <div className='nav-button group'>
                    <img src={images.groupicon}/>
                    <p>Groups</p>
                </div>
                <div className='nav-button create' onClick={create}>
                    <img src={images.createicon}/>
                    <p>Create</p>
                </div>
                <div className='nav-button message'>
                    <img src={images.messageicon}/>
                    <p>Messages</p>
                </div>
                <div className='nav-button account'>
                    <img src={images.profileicon}/>
                    <p>Account</p>
                </div>
            </nav>
        </div>
    );
}
