import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const createSession = new CreateSessionService();
    const { user, token } = await createSession.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  } catch ({ message: errorMessage }) {
    return response.status(400).json({ error: errorMessage });
  }
});

export default sessionRoutes;
