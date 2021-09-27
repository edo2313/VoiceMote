const {
    Voicemeeter,
    StripProperties
} = require('voicemeeter-connector');
var vm = Voicemeeter.init();
var stripNumber = 0;

const IP = require("ip").address();

var config = require(__dirname + '/app/views/config');
const PORT = config.port;

const express = require("express")
const app = express();
let http = require('http').Server(app);

var qrcode = require('qrcode-terminal');

app.use(express.static(__dirname + '/app/views/'));

http.listen(PORT, () => {
    console.log(`Connect to the web interface at http://${IP}:${PORT} or scan the QR code below`);
    qrcode.generate(`http://${IP}:${PORT}`, {small: true});
    vm.then(async (vminstance) => {
        vminstance.connect();
        console.log('VM connected');
        vm = vminstance;
    });
});

let io = require('socket.io')(http);

io.on('connection', (socket) => {

    function updateData() {
        let data = [];
        for (let i = 0; i < stripNumber; i++) {
            let strip = {};
            for (const property in StripProperties) {
                strip[property] = vm.getStripParameter(i, StripProperties[property]);
            }
            data.push(strip);
        };
        return data;
    }
    socket.on('ready', () => {
        console.log('Connected');
        vm.updateDeviceList();
        data = {
            type: vm.type,
            version: vm.version,
            inputDevices: vm.inputDevices,
            outputDevices: vm.outputDevices
        };
        stripNumber = (vm.type == 'voicemeeter') ? 3 : ((vm.type == 'voicemeeterBanana') ? 5 : 7);
        socket.emit('info', JSON.stringify(data));
        socket.emit('newdata', JSON.stringify(updateData()));
    });

    vm.attachChangeEvent(() => {
        socket.emit('newdata', JSON.stringify(updateData()));
    });

    socket.on('disconnect', () => {
        console.log("Disconnected");
    });

});

app.get('/version', function (req, res) {
    res.send({
        type: vm.type,
        version: vm.version,
        ins: vm.inputDevices,
        out: vm.outputDevices
    });
});

app.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});

/*
vm.then(async (vm) => {
    // Connect to your voicemeeter client
    vm.connect();

    // Sets gain of strip 0 to -10db
    await vm.setStripParameter(0, StripProperties.Gain, -10);

    // Print gain
    console.log(vm.getStripParameter(0, StripProperties.Gain));
    console.log(vm.getStripParameter(0, StripProperties.Label));


    // Attach event handler


    // Disconnect voicemeeter client
    setTimeout(() => {
        vm.disconnect();
        process.exit(0);
    }, 5000);
});
*/