const Hapi = require('@hapi/hapi');
// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();
const ClientError = require('./exceptions/ClientError');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan response dari request
    const { response } = request;
    if (response instanceof ClientError) {
      // membuat response baru dari response error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    if (response instanceof Error) {
      const { statusCode, payload } = response.output;
      switch (statusCode) {
        case 500:
          payload.message = 'Maaf terjadi kesalahan pada server kami';
          console.log(response);
          const newResponse = h.response({
            status: 'error',
            message: payload.message,
          }).code(500);
          return newResponse;
        default:
          return h.response(payload).code(statusCode);
      }
    }
    // jika bukan clienterror dan server error , lanjutkan dengan response sebelumnya
    return response.continue || response;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
