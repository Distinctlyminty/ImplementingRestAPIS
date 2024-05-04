const request = require('supertest');
const app = require('../app'); 

let server;

beforeAll(done => {
  server = app.listen(3001, done);
});

afterAll(done => {
  server.close(done);
});

describe('GET /swagger', () => {
  it('should return a 200 response', async () => {
    const res = await request(server)
      .get('/swagger/');

    expect(res.statusCode).toEqual(200);
  });
});