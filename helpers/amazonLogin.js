module.exports = {

  // User ID verification for GET(user)/POST/PUT/DELETE routes
  authUser: function (req, res) {
    // Set where condition based on environment
    if (process.env.AMAZON_CLIENT_ID) {
      if (req.session.passport) {
        return { where: { AmazonId: req.session.passport.user }};

      // If user is not logged in, deny request
      } else {
        res.json({ error: 'Authentication failed / not logged in' });
      }

    } else {
      return { where: { id: 1 }};
    }
  },

  // True if user is logged in (or local env), false otherwise
  isLoggedIn: function (req, res) {
    if (process.env.AMAZON_CLIENT_ID) return !!req.session.passport;
    return true;
  },

  // Render page with user's first name
  renderWithUsername: function  (uri, req, res) {
    if (isLoggedIn(req, res)) {
      models.User.findOne(authUser(req, res))
      .then(user => res.render(uri, { isLoggedIn: true, username: user.displayName.split(" ")[0] }))

    } else res.render(uri, { isLoggedIn: false });
  }
}
