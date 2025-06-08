import HttpException from './HttpException';

class ExistedException extends HttpException {
  constructor(o: string) {
    super(400, `${o} already exists`);
  }
}

export default ExistedException;