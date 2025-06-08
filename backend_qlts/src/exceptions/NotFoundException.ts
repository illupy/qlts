import HttpException from './HttpException';

class NotFoundException extends HttpException {
  constructor(o: string) {
    super(404, `${o} not found`);
  }
}

export default NotFoundException;