require('express');
require('mongodb');
exports.setApp = function (app, client) {
    // Old Card Endpoints for reference
    app.post('/api/addcard', async (req, res, next) => {
        // incoming: userId, color
        // outgoing: error
        var token = require('./createJWT.js');
        const { userId, card, jwtToken } = req.body;
        try {
            if (token.isExpired(jwtToken)) {
                var r = { error: 'The JWT is no longer valid', jwtToken: '' };
                res.status(200).json(r);
                return;
            }
        }
        catch (e) {
            console.log(e.message);
        }
        const newCard = { Card: card, UserId: userId };
        var error = '';
        try {
            const db = client.db();
            const result = db.collection('Cards').insertOne(newCard);
        }
        catch (e) {
            error = e.toString();
        }

        var refreshedToken = null;
        try {
            refreshedToken = token.refresh(jwtToken);
        }
        catch (e) {
            console.log(e.message);
        }
        var ret = { error: error, jwtToken: refreshedToken };
        res.status(200).json(ret);
    });

    app.post('/api/searchcards', async (req, res, next) => {
        // incoming: userId, search
        // outgoing: results[], error
        var error = '';
        const { userId, search, jwtToken } = req.body;
        try {
            if (token.isExpired(jwtToken)) {
                var r = { error: 'The JWT is no longer valid', jwtToken: '' };
                res.status(200).json(r);
                return;
            }
        }
        catch (e) {
            console.log(e.message);
        }

        var _search = search.trim();
        const db = client.db();
        const results = await db.collection('Cards').find({
            "Card": {
                $regex: _search + '.*',
                $options: 'i'
            }
        }).toArray();
        var _ret = [];

        for (var i = 0; i < results.length; i++) {
            _ret.push(results[i].Card);
        }

        var refreshedToken = null;
        try {
            refreshedToken = token.refresh(jwtToken);
        }
        catch (e) {
            console.log(e.message);
        }
        var ret = { results: _ret, error: error, jwtToken: refreshedToken };
        res.status(200).json(ret);
    });



    //Auth API Endpoints
    app.post('/api/auth/login', async (req, res, next) => {
        // incoming: email, password
        // outgoing: id, token, firstName, lastName, error
        var error = '';
        const { email, password } = req.body;
        const db = client.db('users_management');
        const results = await db.collection('users').find({ email: email, password: password }).toArray();
        var id = -1;
        var fn = '';
        var ln = '';
        var ret;
        if (results.length > 0) {
            id = results[0].userId;
            fn = results[0].firstName;
            ln = results[0].lastName;
            try {
                const token = require("./createJWT.js");
                ret = token.createToken( fn, ln, id );
            }
            catch (e) {
                ret = {error: e.message};
            }
        }
        else {
            ret = { error: "Login/Password incorrect" };
        }
        res.status(200).json(ret);
    });

    app.post('/api/auth/register', async (req, res, next) => {
        // incoming: firstName, lastName, email, login, password
        // outgoing: error
        var error = '';
        
        const { firstName, lastName, email, password, displayName, bio} = req.body;
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            displayName: displayName,
            profilePhotoUrl: null,
            bio: bio,
            major: null,
            classYear: null,
            interests: null,
            createdAt: new Date()
        };

        try {
            const db = client.db('user_management');
            const lastUser = await db.collection('users').find().sort({ userId: -1 }).limit(1).toArray();
            var newUserId = 1;
            if (lastUser.length > 0) {
                newUserId = lastUser[0].userId + 1;
            }
            newUser.userId = newUserId;
            const result = await db.collection('users').insertOne(newUser);
        }
        catch (e) {
            error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
    });



    //Survey Submission API Endpoints
    app.post('/api/survey/submit', async (req, res, next) => {
        //incoming: userId, interests[string, string...], major, classYear, bio
        //outgoing: message("Survey Saved"), error

        var error = '';
        const { userId, interests, major, classYear } = req.body;

        try {
            const db = client.db('user_management');
            const result = await db.collection('users').updateOne(
                { userId: userId },
                {
                    $set: {
                        interests: interests,
                        major: major,
                        classYear: classYear
                    }
                }
            );
        }
        catch (e) {
            error = e.toString();
        }
        var ret = { message: "Survey Saved", error: error };
        res.status(200).json(ret);
    });



    //Posts Endpoints
    app.post('/api/posts/create', async (req, res, next) => {
        // incoming: userId, title, description, tags, capacity
        // outgoing: post, error

        var error = '';
        const { userId, title, description, tags, capacity } = req.body;
        const newPost = {
            userId: userId,
            title: title,
            description: description,
            tags: tags,
            capacity: capacity,
            likeCount: 0,
            commentCount: 0,
            createdAt: new Date(),
            comments: [],
            postId: null,
            userId: userId
        };

        try {
            const db = client.db('posts_management');
            const lastPost = await db.collection('posts').find().sort({ postId: -1 }).limit(1).toArray();
            var newPostId = 1;
            if (lastPost.length > 0) {
                newPostId = lastPost[0].postId + 1;
            }
            newPost.postId = newPostId;
            const result = await db.collection('posts').insertOne(newPost);
        }
        catch (e) {
            error = e.toString();
        }
        var ret = { post: newPost, error: error };
        res.status(200).json(ret);
    });
}
