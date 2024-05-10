const express = require('express');
const usersData = require('../data/users');
const {generateToken, verifyToken, alreadyLoged} = require('../middlewares/loginMW');
const router = express.Router();


router.get('/', alreadyLoged, (req, res) => {
    const userId = req.user;
    const user = usersData.find((user) => user.id === userId);

    if (!user) {
        res.send(`
        <form action="/login" method="post">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Iniciar sesión</button>
        </form>
        `);
    } else {
        res.send(`
        <h1>Already loged</h1>
        <a href="/search">API RICK & MORTY</a> 
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesion</button>
        </form>
        `);  
    }  
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    const user = usersData.find((user) => user.username === username && user.password === password);

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/search');
    } else {
        res.status(401).json( { mensaje: 'Credenciales incorrectas' });
    }
});

router.get('/search', verifyToken, (req, res) => {
    const userId = req.user;

    const user = usersData.find((user) => user.id === userId);
  
    if (user) {
      res.send(`
        <h1>Bienvenido, ${user.name}</h1>
        <h2>Busca el personaje que quieras en la API</h2>
        <form action="/characters/:nombre" method="get">    
            <label for="charName">Personaje:</label>
            <input type="text" id="charName" name="charName" required><br>
            <button type="submit">Obten personaje</button>
        </form>
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesion</button>
        </form>
      `);
    } else {
      res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;



