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

db.courses.insertMany([
  {
    "subject": "CS",
    "number": "493",
    "title": "Cloud Application Development",
    "term": "sp19",
  }
])