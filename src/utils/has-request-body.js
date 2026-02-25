/**
 * Check if a request has a request body.
 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.3
 *
 * @param {import('http').IncomingMessage} request
 * @returns {boolean}
 */
export function hasRequestBody(request) {
  // transfer-encoding
  if (request.headers['transfer-encoding'] !== undefined) {
    return true;
  }
  // content-length
  if (
    !isNaN(request.headers['content-length']) &&
    request.headers['content-length'] !== '0'
  ) {
    return true;
  }
  return false;
}
