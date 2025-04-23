// Custom error for Bad Request (400)
export class BadRequestError extends Error {
    statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.statusCode = 400;
      this.name = "BadRequestError";
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Custom error for Not Found (404)
  export class NotFoundError extends Error {
    statusCode: number;
  
    constructor(message: string) {
      super(message);
      this.statusCode = 404;
      this.name = "NotFoundError";
      Error.captureStackTrace(this, this.constructor);
    }
  }
  