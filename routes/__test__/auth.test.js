const request = require('supertest');
const app = require('../../server');

it('returns a 200 on successful signup - role admin', async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: 'username', password: 'passA14!word', role: 'admin' })
    .expect(200);
});

it('returns a 200 on successful signup - role client', async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: 'newClient', password: 'passA14!word' })
    .expect(200);
});

it('returns a 400 on unsuccessful signup - password', async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: 'newClient', password: 'password' })
    .expect(400);
});

it('returns a 400 on unsuccessful signup - no username', async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: '', password: 'password' })
    .expect(400);
});

it('returns a 400 with duplicate usernames', async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: 'newClient', password: 'p@SSword213' })
    .expect(200);
  await request(app)
    .post('/api/signup')
    .send({ username: 'newClient', password: 'p@SSword213' })
    .expect(400);
});

it('fails when username that does not exist is supplied', async () => {
  await request(app)
    .post('/api/signin')
    .send({ username: 'nouser', password: 'p@SSword123' })
    .expect(400);
});

it('sucessfully signs in user', async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: 'workinguser', password: 'p@Ssw0rd21' });

  await request(app)
    .post('/api/signin')
    .send({ username: 'workinguser', password: 'p@Ssw0rd21' })
    .expect(200);
});
