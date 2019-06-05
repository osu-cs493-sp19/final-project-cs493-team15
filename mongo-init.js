/*
* Initialize Database
*/

// CREATE USER
db.createUser({
  user: "tarpaulin",
  pwd: "hunter2",
  roles: [ { role: "readWrite", db: "tarpaulinDB" } ]
});
