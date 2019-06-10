/*
* Initialize Database
*/

// CREATE USER
db.createUser({
  user: "tarpaulin",
  pwd: "hunter2",
  roles: [ { role: "readWrite", db: "tarpaulinDB" } ]
});

db.users.insertMany([
  {
    "_id" : ObjectId("5cca056dc56deb6a14e0a650"),
    "name": "Admin",
    "email": "admin@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "admin"
  },
  {
    "_id" : ObjectId("5cca056dc56deb6a14e0a640"),
    "name": "Jimwel Aguinaldo",
    "email": "jimwel.aguinaldo@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "student"
  },
  {
    "_id" : ObjectId("5cca056dc56deb6a14e0a645"),
    "name": "Kyle Andrews",
    "email": "andrekyl@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "student"
  },
  {
    "_id" : ObjectId("5cca056dc56deb6a14e0a646"),
    "name": "Vincent Ta",
    "email": "tav@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "student"
  },
  {
    "_id" : ObjectId("5cca056dc56deb6a14e0a641"),
    "name": "Rob Hess",
    "email": "rob.hess@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "instructor"
  },
  {
    "_id" : ObjectId("5cca056dc56deb6a14e0a642"),
    "name": "Kirsten Winters",
    "email": "kirsten.winters@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "instructor"
  }
])

db.courses.insertMany([
  {
    "_id": ObjectId("5cca056dc56deb6a14e0a643"),
    "subject": "CS",
    "number": "493",
    "title": "Cloud Application Development",
    "term": "sp19",
    "instructorId": ObjectId("5cca056dc56deb6a14e0a641")
  },
  {
    "_id": ObjectId("5cca056dc56deb6a14e0a644"),
    "subject": "CS",
    "number": "463",
    "title": "Capstone",
    "term": "sp19",
    "instructorId": ObjectId("5cca056dc56deb6a14e0a642")
  }
]);

db.courseEnrollment.insertMany([
  {
    "_id": ObjectId("5cca056dc56deb6a14e0a643"),
    "enrolled": [
      ObjectId("5cca056dc56deb6a14e0a640"),
      ObjectId("5cca056dc56deb6a14e0a645"),
      ObjectId("5cca056dc56deb6a14e0a646")
    ]
  },
  {
    "_id": ObjectId("5cca056dc56deb6a14e0a644"),
    "enrolled": [
      ObjectId("5cca056dc56deb6a14e0a640"),
      ObjectId("5cca056dc56deb6a14e0a645"),
      ObjectId("5cca056dc56deb6a14e0a646")
    ]
  }
]);

db.courseAssignments.insertMany([
  {
    "_id": ObjectId("5cca056dc56deb6a14e0a643"),
    "assignments": [
      "123",
      "321",
      "456"
    ]
  },
  {
    "_id": ObjectId("5cca056dc56deb6a14e0a644"),
    "assignments": [
      "456",
      "789",
      "123"
    ]
  }
]);