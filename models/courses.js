/*
 * Course schema and data accessor methods;
 */
const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const CourseSchema = {
    description: { required: false },
    subject: { required: true },
    number: { required: true },
    title: { required: true},
    term: { required: true},
    instructorId: { required: true}
 };
 exports.CourseSchema = CourseSchema;

 /*
 * Executes a DB query to insert a new course into the database.  Returns
 * a Promise that resolves to the ID of the newly-created course entry.
 */
 async function insertNewCourse(course) {
  course = extractValidFields(course, CourseSchema);
  const db = getDBReference();
  const collection = db.collection('courses');
  const result = await collection.insertOne(course);
  return result.insertedId;
}
exports.insertNewCourse = insertNewCourse;
