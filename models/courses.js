/*
 * Course schema and data accessor methods;
 */
const { ObjectId } = require('mongodb');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');

const { Parser } = require('json2csv');

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

/*
 * Executes a DB query to return a single page of courses.  Returns a
 * Promise that resolves to an array containing the fetched page of courses.
 */
async function getCoursesPage(page) {
  const db = getDBReference();
  const collection = db.collection('courses');
  const count = await collection.countDocuments();

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getCoursesPage = getCoursesPage;

 /*
 * Executes a DB query to fetch a course based on the specified id.
 */
async function getCourseById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getCourseById = getCourseById;

 /*
 * Executes a DB query to delete a course based on the specified id.
 */
async function deleteCourseById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    result = await collection.remove({ _id: ObjectId(id) });
    return result;
  }
}
exports.deleteCourseById = deleteCourseById;

 /*
 * Executes a DB query to update a course based on the specified id.
 * Takes in the id and the fields to be updated as arguments.
 */
async function updateCourseById(id, body) {
  const db = getDBReference();
  const courseValues = {
    "subject": body.subject,
    "number": body.number,
    "title": body.title,
    "term": body.term,
    "instructorId": body.instructorId
  };
  const collection = db.collection('courses');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    result = await collection.update({ _id: ObjectId(id)}, courseValues);
    return result;
  }
}
exports.updateCourseById = updateCourseById;

 /*
 * Executes a DB query to get course enrollment based on the specified id.
 * Takes in the id and queries the courseEnrollment collection.
 */
async function getCourseEnrollment(id) {
  const db = getDBReference();
  const collection = db.collection('courseEnrollment');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getCourseEnrollment = getCourseEnrollment;


 /*
 * Executes a DB query to get course assignments based on the specified id.
 * Takes in the id and queries the courseAssignments collection.
 */
async function getCourseAssignments(id) {
  const db = getDBReference();
  const collection = db.collection('courseAssignments');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getCourseAssignments = getCourseAssignments;

 /*
 * Executes a DB query to update course enrollment based on the specified id.
 * Takes in the id and the request body to update the courseEnrollment collection.
 */
async function updateEnrollment(id, body) {
  const db = getDBReference();
  const collection = db.collection('courseEnrollment');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    if (body.add){
      body.add.forEach(async function(element) {
        console.log("add", element);
        await collection.update( { _id: ObjectId(id) }, { $push : { 'enrolled': ObjectId(element) } } );
      });
    } 
    if (body.remove){
      body.remove.forEach(async function(element) {
        console.log("remove", element);
        await collection.update( { _id: ObjectId(id) }, { $pull : { 'enrolled': ObjectId(element) } } );
      });
    }
  }
  return collection;
}
exports.updateEnrollment = updateEnrollment;

 /*
 * Executes a DB query to return a CSV of the students enrolled in the course.
 * Takes in the id and queries the users collection.
 */
async function getEnrollmentCSV(id){
  const db = getDBReference();
  const collection = db.collection('users');

  const courseEnrollment = await getCourseEnrollment(id);

  var students = [];

  for (const element of courseEnrollment.enrolled) {
    var student = await collection.find( { _id: ObjectId(element) } ).toArray();
    students.push(student[0]);
  }
  const fields = ['_id', 'name', 'email'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(students);

  return csv;
}
exports.getEnrollmentCSV = getEnrollmentCSV;

 /*
 * Executes a DB query to check if the specified id is the instructor for the class.
 */
async function checkProperInstructor(id, instructorId){
	const db = getDBReference();
	const collection = db.collection('courses');
	try{
		var course = await collection.find({_id: ObjectId(id)}).toArray();
    course = course[0];
		if(course.instructorId == instructorId){
      console.log("here1");
			return true;
		} else{
      console.log("here2");

      return false;
    }
	} catch(err){
    console.log("here3");

		return false;
	}
}
exports.checkProperInstructor = checkProperInstructor;