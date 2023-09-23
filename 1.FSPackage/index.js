const fs = require('fs');

// Synchronously File System Module
// ReadFile
const data = fs.readFileSync('./data.txt', 'utf-8');
console.log('data --> ', data);
// Write File
const addData = `Adding this new content in a file. ${data}\n Data is created on ${Date.now()}`;
fs.writeFileSync('./output.txt', addData);

// Asynchronously File System Module
fs.readFile('./data.txt', 'utf-8', (err, data) => {
    if(!data) throw err;
    console.log(data);
    const addData = `Adding this new content in a file. ${data}\n Data is created on ${Date.now()}`;
    
    fs.writeFile('./abc.txt', addData, (err2) => {
        if(err2) throw err2;
    });
});
