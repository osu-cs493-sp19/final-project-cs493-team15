/*
 * API sub-router for users collection endpoints.
 */

 const router = require('express').Router();

 const { validateAgainstSchema } = require('../lib/validation');
 const {
   UserSchema,
   UserLoginSchema
} = require('../models/users');

 /*
 * Route to create a new user.
 */
router.post('/', async (req, res) => {

});


/*
* Route to login a user.
*/
router.post('/login', async (req, res) => {

});


/*
 * Route to fetch data about a specific user.
 */
router.get('/:id', async (req, res) => {

});
