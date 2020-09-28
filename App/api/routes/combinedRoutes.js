const usersRoutes = require("./usersRoutes");
const postsRoutes = require("./postsRoutes");
const adminRoutes = require("./adminRoutes");

module.exports = (app) => {
  usersRoutes(app);
  postsRoutes(app);
  adminRoutes(app);
}
