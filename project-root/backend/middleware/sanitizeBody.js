import xss from 'xss';

// sanitize all string fields in an object
function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// Middleware for sanitizing
function sanitizeBody(req, res, next) {
  if (req.body) {
    sanitizeObject(req.body);
  }
  next();
}

export default sanitizeBody;
