const request = require('supertest');
const express = require('express');
const app = require('../app'); 

let server;

beforeAll(done => {
  server = app.listen(3000, done);
});

afterAll(done => {
  server.close(done);
});

describe('GET /oauth2/v2.0/token', () => {
  it('should return a token payload', async () => {
    const res = await request(server)
      .get('/oauth2/v2.0/token');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('expires_in', 3600);
    expect(res.body).toHaveProperty('token_type', 'Bearer');
  });
});