const yargs = require('yargs');

yargs.command('greet', 'Greet a User', (yargs) => {
     yargs.option('name', {
    alias: 'n',
    type: 'string',
    description: 'Enter Your Name',
    demandOption: true,
  })
}).help().argv;

const argv = yargs.argv;
console.log(argv);

if(argv._[0] === 'greet') {
    console.log("Hello", argv.name);
}

// const a = process.argv;
// console.log(a[1]);