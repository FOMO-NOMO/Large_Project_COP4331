import React from 'react';


import { PostsAPI } from '../../api/posts';
import { AuthAPI } from '../../api/auth';


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
        console.log(data);
    }



    return(
        <div className='navbar-container'>
            <nav>
                <div className='nav-button home'>h</div>
                <div className='nav-button group'>g</div>
                <div className='nav-button create' onClick={create}>Create</div>
                <div className='nav-button message'>m</div>
                <div className='nav-button account'>account</div>
            </nav>
        </div>
    );
}
