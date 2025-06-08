import HttpException from './HttpException';

class InvalidateInputException extends HttpException {
  constructor(field: string) {
    super(422, `Invalidate ${field} field`);
  }
}

export default InvalidateInputException;