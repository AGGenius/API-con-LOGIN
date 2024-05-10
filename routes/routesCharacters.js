const axios = require("axios");
const express = require("express");
const router = express.Router();
const { verifyToken }  = require('../middlewares/loginMW')

router.get('/', verifyToken, async (req, res) => {
    const apiEndP = 'https://rickandmortyapi.com/api/character';

    try {       
        const response = await axios.get(apiEndP);
        data = response.data;
        
        res.json(data.results);
    } catch(err) {
        res.status(404).json({ error: `Couldn't reach the API: ${err}`});
    }
})

router.get('/:nombre', verifyToken, async (req, res) => {       
    const charName = req.query['charName'].toLowerCase();   
    const apiEndP = `https://rickandmortyapi.com/api/character/?name=${charName}`;

    try {
        const response = await axios.get(apiEndP);
        data = response.data.results[0];
        const {name, status, species, gender, origin, image} = data;

        const characterInfo = `
              <h2>${name}</h2>
              <p><strong>Estatus:</strong> ${status}</p>
              <p><strong>Especie:</strong> ${species}</p>
              <p><strong>Genero:</strong> ${gender}</p>
              <p><strong>Origen:</strong> ${origin.name}</p>
              <img src="${image}" alt="${name}">
              <br> <form action="/logout" method="post"> 
            <button type="submit">Cerrar sesión</button> 
            </form>
        `;
        res.send(characterInfo);
        
    } catch(err) {
        res.status(404).json({ error: `${charName} isn't in our database. Err: ${err}`});
    }
})

module.exports = router;