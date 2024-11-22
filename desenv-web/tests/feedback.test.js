import request  from "supertest";
import app  from "../src/app";

describe('POST /api/feedback', () => {
    it('deve retornar 201 e uma mensagem de sucesso ao enviar feedback válido', async () => {
        const feedbackData = {
            comentario: 'Ótimo serviço!',
            avaliacao_estrelas: 5,
        };

        const response = await request(app)
            .post('/api/feedback')
            .send(feedbackData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            mensagem: 'Feedback enviado com sucesso!',
        });
    });

    it('deve retornar 400 se o feedback for inválido', async () => {
        const feedbackData = {
            comentario: 4, 
            avaliacao_estrelas: 'Muito bom!',
        };

        const response = await request(app)
            .post('/api/feedback')
            .send(feedbackData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('mensagem');
    });
});