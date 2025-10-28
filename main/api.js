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



    //Helper Methods

    const sendVerificationEmail = (email, verificationToken, baseUrl) => {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
            }
        });

        const verificationUrl = `${baseUrl}/api/auth/verify?verificationToken=${verificationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Please verify your email address',
            html: `
            <p>Hello,</p>
            <p>Thank you for registering. Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link will expire in 15 minutes.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Error sending email:', error);
            } else {
            console.log('Verification email sent:', info.response);
            }
        });

        return verificationUrl;
    };

    const sendResetEmail = (email, Url) => {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Forgot Password Request',
            html: `
            <p>Hello,</p>
            <p>Forgot your Password? Please click the link below to reset your password:</p>
            <a href="${Url}">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Error sending email:', error);
            } else {
            console.log('Forgot Password email sent:', info.response);
            }
        });

    };


    //Auth API Endpoints
    app.post('/api/auth/login', async (req, res, next) => {
        // incoming: email, password
        // outgoing: id, token, firstName, lastName, error
        var error = '';
        const { email, password } = req.body;
        console.log(email, password);
        const db = client.db('user_management');
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

        var ret = { error: error };
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
            interests: [],
            createdAt: new Date(),
            isVerified: false,
        };

        try {
            const db = client.db('user_management');
            const existingUser = await db.collection('users').findOne({ email: email });
            if (existingUser) {
                error = 'An account with this email already exists.';
                return res.status(400).json({ error: error });
            }

            else{
                const lastUser = await db.collection('users').find().sort({ userId: -1 }).limit(1).toArray();
                var newUserId = 1;
                if (lastUser.length > 0) {
                    newUserId = lastUser[0].userId + 1;
                }
                newUser.userId = newUserId;
                const result = await db.collection('users').insertOne(newUser);

                const token = require("./createJWT.js");
                const verificationToken = token.createToken(newUser.firstName, newUser.lastName, newUser.userId);

                const baseURL = `${req.protocol}://${req.get('host')}`;

                verificationLink = sendVerificationEmail(email, verificationToken, baseURL);

                var ret = { message: 'Registration successful. Please check your email to verify your account.', userId: newUserId, emailVerificationSent: true, verificationLink: verificationLink, error: error };
            }
        }
        catch (e) {
            error = e.toString();
            res.status(500).json({ error: error });
        }
        res.status(201).json(ret);
    });

    app.get('/api/auth/verify', async (req, res) => {
        const jwt = require('jsonwebtoken');
        try {
        const { verificationToken } = req.query;

        if (!verificationToken) {
            return res.status(400).json({ msg: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(verificationToken, process.env.ACCESS_TOKEN_SECRET);
        
        // Get the user ID from the token (it's the MongoDB _id)
        const userId = decoded.userId;
        console.log(userId);
        
        const db = client.db('user_management');
        const user = await db.collection("users").findOne({ userId: userId });

        if (!user) {
            return res.status(400).json({ msg: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(200).send('Email is already verified. You can now log in.');
        }

        // Update the user to set isVerified: true
        await db.collection("users").updateOne(
            { userId: user.userId },
            { $set: { isVerified: true } }
        );

        res.status(200).send('<h1>Email Verified!</h1><p>Your email has been successfully verified. You can now close this tab and log in.</p>');

        } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: 'Invalid or expired token.' });
        }
    });

    app.post('/api/auth/forgot-password', async (req, res, next) => {
        // incoming: email
        // outgoing: message(Password reset email sent), error
    
        var error = '';
        var ret = {error: error};
        const { email } = req.body;

        try {
            const db = client.db('user_management');
            const user = await db.collection('users').findOne({ email: email });
            if (!user) {
                error = 'No account with that email address exists.';
            } else {
                const token = require('./createJWT.js');
                const resetToken = token.createToken(user.firstName, user.lastName, user.userId);

                const baseURL = `${req.protocol}://${req.get('host')}/reset-password?resetToken=${resetToken}`;
                
                sendResetEmail(email, resetToken, baseURL);

                var ret = { message: "Password reset email sent", resetToken: resetToken, error: error};
            }
        }
        catch (e) {
            error = e.toString();
            ret = {error:error};
            res.status(500).json(ret);
        }
        
        res.status(200).json(ret);
    });

    app.post('/api/auth/reset-password', async (req, res, next) => {
        // incoming: resetToken, newPassword
        // outgoing: message(Password has been reset), error
    
        var error = '';
        var ret = {error: error};
        const { resetToken, newPassword } = req.body;

        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(resetToken, process.env.ACCESS_TOKEN_SECRET);
            const userId = decoded.userId;

            const db = client.db('user_management');
            const result = await db.collection('users').updateOne(
                { userId: userId },
                { $set: { password: newPassword } }
            );

            var ret = { message: "Password has been reset", error: error};
        }
        catch (e) {
            error = e.toString();
            ret = {error:error};
            res.status(500).json(ret);
        }
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
            const db = client.db('user_management');
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
