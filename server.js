const { Voicemeeter, StripProperties, BusProperties} = require('voicemeeter-connector');
var voicemeeter = Voicemeeter.init();
var stripNumber = 0;
var busNumber = 0;
var ready = false;

var config = require('./app/config.json');
const IP = 'localhost';
const PORT = config.port;

const path = require('path');
const qrcode = require('qrcode-terminal');
const express = require("express")

const app = express();
app.use(express.static('./app/'));

const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {origin: "*"}});

http.listen(PORT, () => {
    console.log(`Connect to the web interface at http://${IP}:${PORT} or scan the QR code below`);
    qrcode.generate(`http://${IP}:${PORT}`, {
        small: true
    });
    voicemeeter.then(async (voicemeeterinstance) => {
        voicemeeterinstance.connect();
        console.log('voicemeeter connected');
        voicemeeter = voicemeeterinstance;
    });
});

io.on('connection', (socket) => {
    function updateData() {
        let strips = [];
        let buses = [];
        
        for (let i = 0; i < stripNumber; i++) {
            let strip = {};
            for (const property in StripProperties) {
                strip[property] = voicemeeter.getStripParameter(i, StripProperties[property]);
            }
            strip["Index"] = i;
            strip["Type"] = voicemeeter.type == "voicemeeterPotato" ? 2 : (voicemeeter.type == "voicemeeterBanana" ? 1 : 0);
            strips.push(strip);
        }

        for (let i = 0; i < busNumber; i++) {   
            let bus = {};
            for (const property in BusProperties) {
                bus[property] = voicemeeter.getBusParameter(i, BusProperties[property]);
            }
            bus["Index"] = i;
            bus["Type"] = voicemeeter.type == "voicemeeterPotato" ? 2 : (voicemeeter.type == "voicemeeterBanana" ? 1 : 0);
            buses.push(bus);
        }
        return {"strips": strips, "buses": buses };
    }
    socket.on('ready', () => {
        console.log('Connected');
        voicemeeter.updateDeviceList();
        let data = {
            type: voicemeeter.type,
            version: voicemeeter.version,
            inputDevices: voicemeeter.inputDevices,
            outputDevices: voicemeeter.outputDevices
        };
        stripNumber = (voicemeeter.type == 'voicemeeter') ? 3 : ((voicemeeter.type == 'voicemeeterBanana') ? 5 : 7);
        busNumber = (voicemeeter.type == 'voicemeeter') ? 3 : ((voicemeeter.type == 'voicemeeterBanana') ? 5 : 7);
        socket.emit('info', JSON.stringify(data));
        socket.emit('newdata', JSON.stringify(updateData()));
        ready = true;
    });

    socket.on('setStrip', (data) => {
        data = JSON.parse(data);
        ready = false;
        let promises = [];
        const id = data["Index"];
        promises.push(voicemeeter.setStripParameter(id, StripProperties.Gain, data["Gain"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.Mute, +data["Mute"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.A1, +data["A1"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.A2, +data["A2"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.A3, +data["A3"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.A4, +data["A4"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.A5, +data["A5"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.B1, +data["B1"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.B2, +data["B2"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.B3, +data["B3"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.Mono, +data["Mono"]));
        promises.push(voicemeeter.setStripParameter(id, StripProperties.Solo, +data["Solo"]));

        Promise.all(promises).then(() => {
            ready = true;
        });
    });

    socket.on('setBus', (data) => {
        data = JSON.parse(data);
        ready = false;
        let promises = [];
        const id = data["Index"];
        promises.push(voicemeeter.setBusParameter(id, BusProperties.Gain, data["Gain"]));
        promises.push(voicemeeter.setBusParameter(id, BusProperties.Mute, +data["Mute"]));
  
        Promise.all(promises).then(() => {
            ready = true;
        });
    });

    voicemeeter.attachChangeEvent(() => {
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
        type: voicemeeter.type,
        version: voicemeeter.version,
        ins: voicemeeter.inputDevices,
        out: voicemeeter.outputDevices
    });
});

app.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});

function exitHandler(options, exitCode) {
    voicemeeter.disconnect();
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exitHandler.bind(null, eventType));
  })