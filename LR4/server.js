const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/analyze', async (req, res) => {
    const apiKey = '2625b21f0c0e988936253d652ea1fafbcc176a54e67b9ab2f1cb1df9';
    try {
        const response = await axios.post('https://api.textrazor.com/', req.body, {
            headers: {
                'x-textrazor-key': apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
