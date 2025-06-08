class HttpException extends Error {
  public status: string;
  public statusCode: number;
  public message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = "error";
    this.message = message;
  }
}

export default HttpException;