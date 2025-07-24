const express = require('express');
const app = express();
const cors = require('cors');
const notasRouter = require('./routes/notas');

app.use(cors());
app.use(express.json());

app.use('/notas', notasRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Microservicio Blockchain corriendo en http://localhost:${PORT}`);
});
