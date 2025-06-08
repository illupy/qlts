import HttpException from './HttpException';

class CannotDeleteException extends HttpException {
  constructor(o: string) {
    super(400, `${o} is in use and cannot be deleted. `);
  }
}

export default CannotDeleteException;