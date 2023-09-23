const express = require("express");

const app = express();
const PORT = 5000;


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', (req, res) => {
    res.send('You can send a post request to this endpoint');
});

app.all('*', (req, res) => {
    res.status(404).send("<h1>404 | Page Not Found</h1>");
});

app.listen(PORT, 'localhost', () => {
    console.log(`server is running on at port: ${PORT}`);
});
