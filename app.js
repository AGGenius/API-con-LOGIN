const express = require('express');
const app = express();
const session = require('express-session');
const secret = require('./crypto/config');
// Routes
const characterRoutes = require('./routes/routesCharacters');
const loginRoutes = require('./routes/login');

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    })
);

app.use('/', loginRoutes);
app.use('/characters', characterRoutes);

app.listen(port, () => {
    console.log(`Server active at port http://localhost:${port}`);
})