const { getDBReference } = require('../lib/mongo');
const { ObjectId } = require('mongodb');

const { extractValidFields } = require('../lib/validation');

const AssignmentSchema = {
  courseId: { required: true },
  title: { required: true},
  points: { required: true},
  due: { required: true}
};
exports.AssignmentSchema = AssignmentSchema;

const SubmissionSchema = {
  assignmentId: { required: true },
  studentId: { required: true },
  timestamp: { required: true },
  file: { required: true }
};
exports.SubmissionSchema = SubmissionSchema;

async function insertNewAssignment(assignment) {
  assignment = extractValidFields(assignment, AssignmentSchema);
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}
exports.insertNewAssignment = insertNewAssignment;

exports.getAssignmentsPage = async function (page) {
  const db = getDBReference();
  const collection = db.collection('assignments');
  const count = await collection.countDocuments();

  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    assignments: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
};

async function getAssignmentsByID(id) {
  const db = getDBReference();
  const collection = db.collection('assignments')
  const results = await collection.find({_id: new ObjectId(id)}).toArray();
  return results[0];
}
exports.getAssignmentsByID = getAssignmentsByID;

async function  updateAssignmentByID(id, assignment) {
  const assignmentValues = {
    courseId: assignment.courseId,
    title: assignment.title,
    points: assignment.points,
    due: assignment.due
  };
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.replaceOne(
    { _id: new ObjectId(id) },
    assignmentValues
  );
  return result.matchedCount > 0;
}
exports.updateAssignmentByID = updateAssignmentByID;

async function deleteAssignmentByID(id) {
  const db = getDBReference();
  const collection = db.collection('assignments');
  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  });
  return result.deletedCount > 0;
}
exports.deleteAssignmentByID = deleteAssignmentByID;

async function getSubmissionsByID(id) {
  const db = getDBReference();
  const collection = db.collection('submissions')
  const results = await collection.find({
    assignmentId: id
  }).toArray();
  return results;
}
exports.getSubmissionsByID = getSubmissionsByID;

async function insertNewSubmission(submission, id) {
  const submissionValues = {
    assignmentId: id,
    studentId: submission.studentId,
    timestamp: submission.timestamp,
    file: "http://localhost:8000/assignments/" + id + "/submissions"
  };
  const db = getDBReference();
  const collection = db.collection('submissions');
  const result = await collection.insertOne(submissionValues);
  return result.insertedId;
}
exports.insertNewSubmission = insertNewSubmission;