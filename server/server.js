var socketio = require('socket.io');
var http = require('http');
var staticFile = require('./lib/static_file');

var server = http.createServer((req, res) => {
    var filePath = manageFilePath(req.url);
    staticFile.serveStaticFile(filePath, res);
});

var manageFilePath = function (url) {
    if (url === '/') {
        return 'public/index.html';
    } else {
        return 'public' + url;
    }
}

server.listen(8000, () => {
    console.log('Server is listining');
});

var io = socketio.listen(server);

var clients = [];
var dashboard;

io.sockets.on('connection', (socket) => {

    console.log('Connection accepted');

    socket.on('hostname', (hostname) => {
        console.log(hostname);
    });

    socket.on('dashboard', () => {
        dashboard = socket;
        console.log('dashboard is set')
    });

    socket.on('platform', (platform) => {
        console.log(platform);
    });

    socket.on('cpu', (usage) => {
        console.log(usage);

        var id = socket.id;
        //TODO dashboard does not exists yet        
        dashboard.emit('cpu', usage);
    });
});