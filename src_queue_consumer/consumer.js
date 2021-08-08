require('dotenv').config();
const amqp = require('amqplib');
const NotesService = require('./services/postgres/NotesService');
const MailSender = require('./services/mailSender/MailSender');
const Listener = require('./services/listener/listener');

const init = async () => {
  const notesService = new NotesService();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  await channel.assertQueue('export:notes', {
    durable: true,
  });
  channel.consume('export:notes', listener.listen, { noAck: true });

  console.log(`Consumer berjalan pada ${process.env.RABBITMQ_SERVER}`);
};
init();