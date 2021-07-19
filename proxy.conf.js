const PROXY_CONFIG = [
  {
	context: ["/auth", "/ricerca"],
	target: "http://localhost:3000",
	secure: false
  }
];

module.exports = PROXY_CONFIG;