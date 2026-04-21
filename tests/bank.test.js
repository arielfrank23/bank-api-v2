const request = require('supertest');
const API_URL = 'https://bank-api-v2-wmp3.onrender.com';

describe('Tests de production - API SGB', () => {
  
  it('Le Swagger doit être accessible en ligne', async () => {
    const res = await request(API_URL).get('/api-docs/');
    expect(res.statusCode).toEqual(200);
  });

  it('Doit retourner une erreur 401 si on tente de voir le solde sans token', async () => {
    const res = await request(API_URL).get('/api/account/balance/11');
    expect(res.statusCode).toEqual(401); 
  });
});

afterAll(async () => {
  // Si tu as un objet sequelize exporté
  // await sequelize.close(); 
  console.log("Tests terminés, fermeture des connexions.");
});