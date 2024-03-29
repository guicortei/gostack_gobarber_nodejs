import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import jwtConfig from '../config/jwtConfig';
import AppError from '../errors/AppError';
import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const userFinded = await userRepository.findOne({
      where: { email },
    });

    if (!userFinded) {
      throw new AppError('Invalid email/password combination.', 401);
    }

    const passwordMatched = await compare(password, userFinded.password);

    if (!passwordMatched) {
      throw new AppError('Invalid email/password combination.', 401);
    }

    const { secret, expiresIn } = jwtConfig;

    const token = sign({}, secret, {
      subject: userFinded.id,
      expiresIn,
    });

    return { user: userFinded, token };
  }
}

export default CreateSessionService;
