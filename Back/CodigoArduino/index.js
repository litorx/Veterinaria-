const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');

const app = express();

var arduinoPort = 'COM14';
const sp = new SerialPort(
  { path: arduinoPort, baudRate: 9600 },
  function (err) {
    if (err) {
      return console.log("Erro: " + err.message);
    }
  }
);

const parser = new ReadlineParser({ delimiter: '\r\n' });
sp.pipe(parser);

sp.on('open', function () {
  console.log("Serial port on " + arduinoPort);
});

parser.on('data', data => {
  console.log(data.toString());
});

app.get('/', function (req, res) {
  return res.send("Funcionando...");
});

app.get('/emergencia', function (req, res) {
  sp.write("emergencia");
  return res.send('Emergência acionada.');
});

app.get('/emergenciaAtendida', function (req, res) {
  sp.write("atendida");
  return res.send('Emergência atendida.');
});

var port = 1000;
app.listen(port, function () {
  console.log("Escutando porta: " + port);
});
