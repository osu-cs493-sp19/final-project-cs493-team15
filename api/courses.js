const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { requireAuthentication } = require('../lib/auth');

const {
    CourseSchema,
    insertNewCourse
} = require('../models/courses');
const {
  getUserById
} = require('../models/users');

 /*
 * Route to get all courses.
 */
router.get('/', async(req, res, next) => {

});

 /*
 * Route to create new course.
 */
router.post('/', requireAuthentication, async(req, res, next) => {
  const user = await getUserById(req.user);
  if(user.role == "admin") {
    if (validateAgainstSchema(req.body, CourseSchema)) {
      try {
        const id = await insertNewCourse(req.body);
        res.status(201).send({
          id: id
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting course into DB.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid course object."
      });
    }
  } else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Route to get specific course.
 */
router.get('/', async(req, res, next) => {

});

 /*
 * Route to update specific course
 */
router.patch('/:id', async(req, res, next) => {

});

/*
 * Route to delete specific course.
 */
router.delete('/:id', async(req, res, next) => {

});


/*
 * Route to get list of students in specific course.
 */
router.get('/:id/students', async(req, res, next) => {

});


/*
 * Route to update enrollment for specific course.
 */
router.post('/:id/students', async(req, res, next) => {

});


/*
 * Route to fetch CSV file containing list of students for specific course.
 */
router.get('/:id/roster', async(req, res, next) => {

});


/*
 * Route to get list of assignments for specific course.
 */
router.get('/:id/assignments', async(req, res, next) => {

});

module.exports = router;
