module.exports = function handler(req, res) {
  res.json({ status: 'test-ok', timestamp: new Date().toISOString() });
};
