// Initializes Express server and configures Socket.IO with CORS support

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Create HTTP server from Express app to support Socket.IO

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});


module.exports = { io, app, server };
