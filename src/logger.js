const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' }, pino.transport({
  targets: [
  {target: 'pino/file', options: { destination: './logs/all.log'}},
  {target: 'pino-pretty', options: { destination: 1 }} // use 2 for stderr
]}));

module.exports = {logger};
