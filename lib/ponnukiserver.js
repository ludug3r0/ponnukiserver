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

    var IGSClient = require('igsclient');
    var client = new IGSClient().connect();

    client.on('connected', function () {
        console.log("Aaaaa");
        client.getGames();
        client.getUsers();
    });

    client.on('games', function (games) {
        console.log('Received games list:');
        console.log(games);
        console.log('Observing the first game on the list.');
        client.observe(games[0].gameId);
    });

    client.on('users', function (users) {
        console.log('Received users list:');
        console.log(users);
    });

    client.on('observe-moves', function (id, moves) {
        console.log('Received updated game position in game ' + id);
        console.log(moves);
    });

    client.on('observe-end', function (id, result) {
        console.log('Game ' + id + ' ended. Result: ' + result);
        client.getGames();
    });
};
