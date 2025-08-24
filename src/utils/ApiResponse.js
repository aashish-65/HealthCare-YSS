class ApiResponse {
  constructor({ statusCode, message, data = null }) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Success is true for status codes 2xx and 3xx
  }
}

module.exports = ApiResponse;
