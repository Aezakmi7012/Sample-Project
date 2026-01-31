const sanitizeHtml = require('sanitize-html');

const sanitizeContent = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'code', 'pre'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'code': ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto']
    }
  });
};

const escapeHtml = (str) => {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'\/]/g, char => htmlEntities[char]);
};

module.exports = {
  sanitizeContent,
  escapeHtml
};
