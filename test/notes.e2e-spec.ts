import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('Notes (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) should log in and return a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ 
        email: 'zalfy@gmail.com', 
        password: 'admin123' })
      .expect(200);

      expect(response.body.accessToken).toBeDefined();
      accessToken = response.body.accessToken;
  });

  it('/users (GET) should fetch all users when authenticated', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });

  it('/users (GET) should return 401 without token', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(401);
  });
});