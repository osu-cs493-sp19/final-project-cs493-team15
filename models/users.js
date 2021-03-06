/*
 * User schema and data accessor methods;
 */
const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');
const bcrypt = require('bcryptjs');

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

/*
 * Executes a DB query to insert a new user into the database.  Returns
 * a Promise that resolves to the ID of the newly-created user entry.
 */
async function insertNewUser(user) {
  user = extractValidFields(user, UserSchema);
  const db = getDBReference();
  const collection = db.collection('users');

  const passwordHash = await bcrypt.hash(user.password, 8);
  user.password = passwordHash;

  const result = await collection.insertOne(user);
  return result.insertedId;
}
exports.insertNewUser = insertNewUser;

/*
* Executes a DB query to fetch information about a single specified
* user based on its email. If no user with the
* specified Email exists, the returned Promise will resolve to null.
*/
async function getUserByEmail(email) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection.find({ email: email }).toArray();
  return results[0];
}
exports.getUserByEmail = getUserByEmail;

/*
* Executes a DB query to fetch information about a single specified
* user based on its ID. If no user with the
* specified ID exists, the returned Promise will resolve to null.
*/
async function getUserById(id) {
  const db = getDBReference();
  const collection = db.collection('users');
  const results = await collection.find({ _id: new ObjectId(id) }).toArray();
  return results[0];
}
exports.getUserById = getUserById;

/*
* Validates a users credentials
*/
async function validateUser(email, password) {
  const user = await getUserByEmail(email);
  const authenticated = user && await bcrypt.compare(password, user.password);
  return authenticated;
}
exports.validateUser = validateUser;
