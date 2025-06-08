import HttpException from './HttpException';

class AccessTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Access token missing');
  }
}

export default AccessTokenMissingException;