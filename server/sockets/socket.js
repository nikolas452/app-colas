const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();
io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();

        console.log(siguiente);
        callback(siguiente);
    });

    // emitir un evento  llamado estadoActual
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimo4()
    });

    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) return callback({ err: true, mensaje: 'El escritorio es necesacrio' })
        let atenderTicket = ticketControl.atenderTicket(data.escritorio);
        callback(atenderTicket);

        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimo4()
        })

    });

});