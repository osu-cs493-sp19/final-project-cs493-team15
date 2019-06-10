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
    "name": "Jimwel Aguinaldo",
    "email": "jimwel.aguinaldo@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "student"
  },
  {
    "name": "Rob Hess",
    "email": "rob.hess@oregonstate.edu",
    "password": "$2a$08$1mCuZV6y4hdBjqqR95JlqegIIzbUR2Xz/NCn8jb0cTyIf/8LwN0le",
    "role": "instructor"
  }
])

db.assignments.insertMany([
  {
    "courseId": 1,
    "title": "Assignment 1",
    "points": 99,
    "due": "2019-06-14T17:00:00-07:00"
  },
  {
    "courseId": 1,
    "title": "Assignment 2",
    "points": 80,
    "due": "2019-06-21T17:00:00-07:00"
  }
])

db.createCollection("submissions");