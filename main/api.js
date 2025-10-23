require('express');
require('mongodb');
exports.setApp = function (app, client) {
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

    app.post('/api/login', async (req, res, next) => {
        // incoming: login, password
        // outgoing: id, firstName, lastName, error
        var error = '';
        const { login, password } = req.body;
        const db = client.db('COP4331Cards');
        const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();
        console.log(results[0]);
        var id = -1;
        var fn = '';
        var ln = '';
        var ret;
        if (results.length > 0) {
            console.log("went to IF");
            id = results[0].UserId;
            fn = results[0].FirstName;
            ln = results[0].LastName;
            console.log("Creating token for " + fn + " " + ln + " with id " + id);
            try {
                const token = require("./createJWT.js");
                ret = token.createToken( fn, ln, id );
            }
            catch (e) {
                ret = { error: e.message, result: results };
            }
        }
        else {
            console.log("went to ELSE");
            ret = { error: "Login/Password incorrect", array: results };
        }
        console.log("Returning from login: ");
        res.status(200).json(ret);
    });

    app.post('api/register', async (req, res, next) => {
        // incoming: firstName, lastName, email, login, password
        // outgoing: error
        var error = '';
        const { firstName, lastName, email, login, password } = req.body;
        const newUser = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Login: login,
            Password: password
        };
        
        try {
            const db = client.db('COP4331Cards');
            const lastUser = await db.collection('Users').find().sort({ UserId: -1 }).limit(1).toArray();
            var newUserId = 1;
            if (lastUser.length > 0) {
                newUserId = lastUser[0].UserId + 1;
            }
            newUser.UserId = newUserId;
            const result = await db.collection('Users').insertOne(newUser);
        }
        catch (e) {
            error = e.toString();
        }
        var ret = { error: error };
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

}
