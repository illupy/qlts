import HttpException from './HttpException';

class InvalidTokenException extends HttpException {
  constructor() {
    super(403, 'Invalid authentication token');
  }
}

export default InvalidTokenException;