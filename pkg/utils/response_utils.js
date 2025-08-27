function jsonResponse(code, message, data = null) {
  return {
    code,
    message,
    data,
  };
}

export function SuccessResponse(code, message, data) {
  return jsonResponse(code, message, data);
}

export function errorResponse(code, message, data) {
  return jsonResponse(code, message, data);
}