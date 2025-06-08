import HttpException from './HttpException';

class ConfirmPasswordNotMatchException extends HttpException {
  constructor() {
    super(400, `Password and confirm password do not match`);
  }
}

export default ConfirmPasswordNotMatchException;