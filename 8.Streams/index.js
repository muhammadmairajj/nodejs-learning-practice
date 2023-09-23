const fs = require('fs');
const http = require('http');

// for(let i=0; i<100; i++) {
//     fs.writeFileSync('./output.txt', 'HelloWorld\n', {flag: 'a'});
// }

// const stream = fs.createReadStream('./output.txt', { encoding: "utf-8", highWaterMark: 10000 });


// stream.on('data', (result) => {
//     console.log(result);
// })

http.createServer((req, res) => {
    const stream = fs.createReadStream('./output.txt', { encoding: 'utf-8', highWaterMark: 10000 });
    stream.on('open', () => {
        console.log('Stream is open and can start the reading file');
        stream.pipe(res);
    })
    stream.on('end', () => {
        console.log('Finished reading the stream');
    })
}).listen(5000, 'localhost');