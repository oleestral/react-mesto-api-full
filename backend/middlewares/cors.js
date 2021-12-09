const corses = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3001",
    "https://oleestral.nomoredomains.work/",
    "http://oleestral.nomoredomains.work/",
    "https://api.oleestral.nomoredomains.work",
    "http://api.oleestral.nomoredomains.work"
  
  ]

module.exports = (req, res, next) => {
    const { origin } = req.headers;
    if (corses.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', true);
    }
  
    const { method } = req;
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const requestHeaders = req.headers['access-control-request-headers'];
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      res.status(200).send({ message: 'OK' });
    }
  
    next();
  };