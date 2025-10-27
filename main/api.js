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
        const results = await db.collection('users').find({ email: login, password: password }).toArray();
        var id = -1;
        var fn = '';
        var ln = '';
        var ret;
        if (results.length > 0) {
            console.log("went to IF");
            id = results[0].userId;
            fn = results[0].firstName;
            ln = results[0].lastName;
            console.log("Creating token for " + fn + " " + ln + " with id " + id);
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
        
        const { firstName, lastName, email, login, password, displayName, profilePhotoUrl, bio, major, classYear, interests,  } = req.body;
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            login: login,
            password: password,
            displayName: displayName,
            profilePhotoUrl: profilePhotoUrl,
            bio: bio,
            major: major,
            classYear: classYear,
            interests: interests,
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

    

}
