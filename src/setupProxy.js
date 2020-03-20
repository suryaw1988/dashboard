const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.post(
    createProxyMiddleware("/v2/**", {
      target: "https://api.digas.id",
      secure: false,
      changeOrigin: true,
    }),
  );

  app.get(
    createProxyMiddleware("/v2/**", {
      target: "https://api.digas.id",
      secure: false,
      changeOrigin: true,
    }),
  );
  app.use("/v2/**", createProxyMiddleware({ target: "https://api.digas.id" }));
};
