const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    // console.log(req.method);
    const url = req.url;
    if(url === '/' || url === '/home') {
        res.end("Hello from Node Home Route");
    } else if(url === '/about') {
        res.end("Hello From About Route.");
    } else if(url === "/api") {
        fs.readFile(`${__dirname}/data.json`, 'utf-8', (err, response) => {
            if(err) throw err;
            const data = JSON.parse(response);
            // console.log(data);
            const str = data.id + " " + data.name;
            res.writeHead(200, {
                'Content-type': "text/html",
            })
            res.end(str);
        });
    } 
    
    else {
        res.writeHead(404, {
            'Content-type': "text/html",
            'customer-header': "hello-world"
        })
        const html = fs.readFileSync("./template.html", 'utf-8');
        res.end(html);
        // res.end("<h1>This route doesn't exists</h1>");
    }
    // console.log(req.url);
    // res.end("Hello from Node Server");
});


const PORT = 5000;

server.listen(PORT, 'localhost', () => {
    console.log(`server is running on port: ${PORT}`)
})