const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const port = 3000;
const SECRET = 'z@ViG@*QPqAb!r&4MRosGSCf';
const contacts = require('./resources/contacts.json');

function checkAuth(req, res, next) {
    if (req.path !== '/login') {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send({ message: 'Token is empty.'})

        jwt.verify(token, SECRET, function(err, decoded) {
            if (err) return res.status(500).send({ message: err.message });

            req.userId = decoded.id;

            next();
        });
    } else {
        next();
    }
}

app.use(express.json());
app.use(checkAuth);
app.listen(port, () => {
    console.log('Server is started on port '+ port +'.');
});


app.post('/login', (req, res) => {
    if (req.body.username === 'user' && req.body.password === 'password') {
        const id = '1';
        const token = jwt.sign({id}, SECRET, {expiresIn: 300});

        res.send({ token });
    } else {
        res.status(403).send({ message: 'Forbidden' });
    }
});


app.get('/contact', (req, res) => {
    res.send(contacts);
});

app.get('/contact/find', (req, res) => {
    const query = req.query.name;
    const filteredContacts =  contacts.filter(
        c => c.name.toLowerCase().includes(query.toLowerCase())
    );

    res.send(filteredContacts);
});

