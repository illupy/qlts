import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, 'Email or password is incorrect');
  }
}

export default WrongCredentialsException;