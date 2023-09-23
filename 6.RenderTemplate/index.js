const http = require("http");
const fs = require("fs");
const ejs = require("ejs");

const student = {
    name: "Mairaj",
    department: "BSCS",
    contact: "92443322"
}

const server = http.createServer((req, res) => {
    const url = req.url;
    if(url === '/') {
        fs.readFile('./template.ejs', 'utf-8', (err, template) => {
            const renderedHTML = ejs.render(template, { student: student });
            res.setHeader('Content-Type', 'text/html')
            res.end(renderedHTML);
        })
    } 
});


const PORT = 5000;

server.listen(PORT, 'localhost', () => {
    console.log(`server is running on port: ${PORT}`)
})