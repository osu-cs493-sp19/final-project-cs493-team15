/*
 * User schema and data accessor methods;
 */
const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a user object.
 */
const UserSchema = {
  name: { required: true },
  email: { required: true },
  password: { required: true },
  role: { required: true }
};
exports.UserSchema = UserSchema;

/*
 * Schema describing required/optional fields of a user login object.
 */
 const UserLoginSchema = {
   email: { required: true },
   password: { required: true }
 };
exports.UserLoginSchema = UserLoginSchema;
