const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on('alarm', (arg1, arg2) => {
    console.log(arg1, arg2);
});

emitter.on('alarm', () => {
    console.log('Another Alarm is emitter');
});

emitter.on('notification', () => {
    console.log('This is notification');
});

emitter.emit('alarm', '6:30AM', '9:00AM');