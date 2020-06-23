const request = require('supertest');
const app = require('../../server');

const getToken = async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: 'adminuser', password: 'P@sswor121', role: 'admin' });

  const res = await request(app)
    .post('/api/signin')
    .send({ username: 'adminuser', password: 'P@sswor121' });

  const token = res.body.token;
  return token;
};

const getClientToken = async () => {
  await request(app)
    .post('/api/signup')
    .send({ username: 'adminuser', password: 'P@sswor121' });

  const res = await request(app)
    .post('/api/signin')
    .send({ username: 'adminuser', password: 'P@sswor121' });

  const token = res.body.token;
  return token;
};

const createProduct = async () => {
  const token = await getToken();
  return request(app)
    .post('/api/product')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'product', description: 'description', price: '21' });
};

it('can create a new product', async () => {
  const token = await getToken();

  const res = await request(app)
    .post('/api/product')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'product', description: 'description', price: '21' })
    .expect(200);

  expect(res.body.product.name).toEqual('product');
  expect(res.body.product.price).toEqual('21');
  expect(res.body.product.description).toEqual('description');
});

it('can fetch a list of products - admin', async () => {
  const token = await getToken();

  await createProduct();
  await createProduct();
  await createProduct();

  const res = await request(app)
    .get('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(200);

  expect(res.body.length).toEqual(3);
});

it('can fetch a single product', async () => {
  const token = await getToken();

  const res = await createProduct();

  const product = await request(app)
    .get(`/api/product/${res.body.product._id}`)
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(200);

  expect(product.body.created_by._id).toBeTruthy();
});

it('fails to create a new product', async () => {
  const token = await getToken();

  const res = await request(app)
    .post('/api/product')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: '', description: 'description', price: '21' })
    .expect(400);
});

it('fails to create a new product when not authenticated', async () => {
  const res = await request(app)
    .post('/api/product')
    .send({ name: 'name', description: 'description', price: '21' })
    .expect(401);
});

it('fails to create a new product for client', async () => {
  const token = await getClientToken();

  const res = await request(app)
    .post('/api/product')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: '', description: 'description', price: '21' })
    .expect(401);
});

it('updates a product with valid input', async () => {
  const token = await getToken();

  const res = await createProduct();

  await request(app)
    .put(`/api/product/${res.body.product._id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'new product', description: 'description', price: '21' })
    .expect(200);

  const productUpdate = await request(app)
    .get(`/api/product/${res.body.product._id}`)
    .set('Authorization', `Bearer ${token}`)
    .send();

  expect(productUpdate.body.name).toEqual('new product');
});
