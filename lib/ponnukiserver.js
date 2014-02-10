/*
 * PonnukiServer
 * www.rafaeloliveira.org/PonnukiServer
 *
 * Copyright (c) 2014 Rafael Oliveira
 * Licensed under the MIT license.
 */

'use strict';

exports.awesome = function() {
  return 'awesome';
};

exports.start = function() {
    var http = require('http');
    var WebSocketServer = require('ws').Server;

    var server = http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello World\n');
    });
    server.listen(process.env.PORT || 8080);

    var wss = new WebSocketServer({server: server});
    console.log('websocket server created');

    wss.broadcast = function(data) {
        for(var i in this.clients) {
            this.clients[i].send(data);
        }
    };

    wss.on('connection', function(ws) {
        console.log('websocket connection open');
        ws.on('close', function() {
            console.log('websocket connection close');
        });
    });

    var IGSClient = require('igsclient');
    var client = new IGSClient().connect();

    client.on('connected', function () {
        client.getGames();
    });

    client.on('games', function (games) {
        console.log('Received games list:');
        //console.log(games);
        console.log('Observing the first game on the list.');
        client.observe(games[0].gameId);
        wss.broadcast({type: 'observing game', data: {id: games[0].gameId} });
    });

    client.on('observe-moves', function (id, moves) {
        console.log('Received updated game position in game ' + id);
        //console.log(moves);
        wss.broadcast({type: 'received moves', data: {id: id, moves: moves} });
    });

    client.on('observe-end', function (id, result) {
        console.log('Game ' + id + ' ended. Result: ' + result);
        wss.broadcast({type: 'ending game', data: {id: id, result: result}});
        client.getGames();
    });
};
