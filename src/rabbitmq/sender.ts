import * as amqp from 'amqplib';

export function sender(msg, queue) {
  amqp
    .connect('amqp://localhost:5672')
    .then((connection) => {
      connection.createChannel().then((channel) => {
        channel.assertQueue(queue, { durable: false });
        channel.senedToQueue(queue, Buffer.from(msg));
      });
      return connection;
    })
    .then((connection) => {
      connection.close();
    });
}
