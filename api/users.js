/*
 * API sub-router for users collection endpoints.
 */

 const router = require('express').Router();

 const { validateAgainstSchema } = require('../lib/validation');
 const { generateAuthToken, requireAuthentication } = require('../lib/auth');
 const {
   UserSchema,
   UserLoginSchema,
   insertNewUser,
   validateUser,
   getUserByEmail,
   getUserById
} = require('../models/users');

 /*
 * Route to create a new user.
 */
router.post('/', async (req, res, next) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    try {
     const id = await insertNewUser(req.body);
     res.status(201).send({
       id: id
     });
    } catch (err) {
     console.error(err);
     res.status(500).send({
       error: "Error inserting user into DB.  Please try again later."
     });
    }
  } else {
    res.status(400).send({
     error: "Request body is not a valid user object."
    });
  }
});


/*
* Route to login as a user.
*/
router.post('/login', async (req, res, next) => {
  if(req.body.email && req.body.password) {
    try {
      const authenticated = await validateUser(req.body.email, req.body.password);
      if (authenticated) {
        const user = await getUserByEmail(req.body.email);
        const token = generateAuthToken(user._id);
        res.status(200).send({
          id: user._id,
          token: token
        });
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials"
        });
      }
    } catch (err) {
      res.status(500).send({
        error: "Error logging in.  Try again later."
      });
    }
  } else {
    res.status(400).json({
    error: "Request body needs email and password."
    });
}
});


/*
 * Route to fetch data about a specific user.
 */
router.get('/:id', requireAuthentication, async (req, res, next) => {
  const user = await getUserById(req.params.id);
  if(req.params.id === req.user) {
    try {
      const user = await getUserById(req.params.id);
      if(user) {
        res.status(200).send({
          id: user._id,
          email: user.email,
          role: user.role,
          courses: [] // Needs to be changed later
        });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch user.  Please try again later."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

module.exports = router;
