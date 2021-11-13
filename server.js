const {
    Voicemeeter,
    StripProperties
} = require('voicemeeter-connector');
var vm = Voicemeeter.init();
var stripNumber = 0;
var ready = false;

var config = require('./app/config.json');
const IP = config.ip;
const PORT = config.port;
// TODO: IP choice on first boot

const path = require('path');
const express = require("express")
const app = express();
let http = require('http').Server(app);

var qrcode = require('qrcode-terminal');

app.use(express.static('./app/'));

http.listen(PORT, () => {
    console.log(`Connect to the web interface at http://${IP}:${PORT} or scan the QR code below`);
    qrcode.generate(`http://${IP}:${PORT}`, {
        small: true
    });
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
            if (!strip.Label) {
                continue;
            }
            strip["Index"] = i;
            strip["Type"] = vm.type == "voicemeeterPotato" ? 2 : (vm.type == "voicemeeterBanana" ? 1 : 0);
            data.push(strip);
        }
        return data;
    }
    socket.on('ready', () => {
        console.log('Connected');
        vm.updateDeviceList();
        let data = {
            type: vm.type,
            version: vm.version,
            inputDevices: vm.inputDevices,
            outputDevices: vm.outputDevices
        };
        stripNumber = (vm.type == 'voicemeeter') ? 3 : ((vm.type == 'voicemeeterBanana') ? 5 : 7);
        socket.emit('info', JSON.stringify(data));
        socket.emit('newdata', JSON.stringify(updateData()));
        ready = true;
    });

    socket.on('setStrip', (data) => {
        data = JSON.parse(data);
        ready = false;
        let promises = [];
        promises.push(vm.setStripParameter(data["Index"], StripProperties.Gain, data["Gain"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.A1, +data["A1"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.A2, +data["A2"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.A3, +data["A3"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.A4, +data["A4"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.A5, +data["A5"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.B1, +data["B1"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.B2, +data["B2"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.B3, +data["B3"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.Mono, +data["Mono"]));
        promises.push(vm.setStripParameter(data["Index"], StripProperties.Solo, +data["Solo"]));
        Promise.all(promises).then(() => {
            ready = true;
        });
    });

    vm.attachChangeEvent(() => {
        if(!ready) {
            return;
        }
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


// Disconnect from Voicemeeter when quitting
function exitHandler(options, exitCode) {
    vm.disconnect();
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exitHandler.bind(null, eventType));
  })