const io = require('socket.io-client');
const { makeMove } = require('./movimiento');

const port = 4000;
const url = `http://192.168.1.104:${port}`;
const tournamentId = '142857';

const socket = io(url);
console.log('Connecting to server...');

const connectHandler = () => {
    console.log('Conectado al servidor.');
    socket.emit("signin", {
        user_name: "MarianaDavid",
        tournament_id: tournamentId,
        user_role: "player"
    });
};

const signinHandler = () => {
    console.log('Asignacion al torneo de manera exitosa.');
};

const readyHandler = (data) => {
    const { game_id, player_turn_id, board } = data;
    const movement = makeMove(board, player_turn_id);
    console.log(`Haciendo el movimiento ${movement}`);
    socket.emit("play", {
        tournament_id: tournamentId,
        player_turn_id: player_turn_id,
        game_id: game_id,
        movement: movement
    });
};

const finishHandler = (data) => {
    console.log("El juego ha termiando");
    socket.emit("player_ready", {
        tournament_id: tournamentId,
        player_turn_id: data.player_turn_id,
        game_id: data.game_id
    });
};

socket.on('connect', connectHandler);
socket.on("ok_signin", signinHandler);
socket.on("ready", readyHandler);
socket.on("finish", finishHandler);

module.exports = { socket };
