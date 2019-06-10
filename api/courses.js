const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');

const {
    CourseSchema,
    insertNewCourse, 
    getCoursesPage,
    deleteCourseById,
    updateCourseById,
    getCourseById,
    getCourseEnrollment,
    getCourseAssignments,
    updateEnrollment,
    getEnrollmentCSV
} = require('../models/courses');

 /*
 * Route to get all courses.
 */
router.get('/', async(req, res) => {
  try {
    var subject = req.query.subject || undefined;
    var number = req.query.number || undefined;
    var term = req.query.term || undefined;

    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const coursePage = await getCoursesPage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = '/courses?page=1';
    }
    res.status(200).send(coursePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching Courses list.  Please try again later."
    });
  }
});

 /*
 * Route to create new course.
 */
router.post('/', async(req, res) => {
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
      error: "The request body was either not present or did not contain a valid Course object."
    });
}
});

/*
 * Route to get specific course.
 */
router.get('/:id', async(req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (course) {
      res.status(200).send(course);
    } else {
      res.status(404).send({
        error: "Specified Course id not found."
      });
    } 
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch Course.  Please try again later."
    });
  }
});

 /*
 * Route to update specific course
 */

router.patch('/:id', async(req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (course) {
      await updateCourseById(req.params.id, req.body);
      res.status(200).send();
    } else {
      res.status(404).send({
        error: "Specified Course id not found."
      });
    } 
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch Course.  Please try again later."
    });
  }
});

/*
 * Route to delete specific course.
 */
router.delete('/:id', async(req, res) => {
  try {
    const course = await deleteCourseById(req.params.id);
    if (course) {
      res.status(204).send();
    } else {
      res.status(404).send({
        error: "Specified Course id not found."
      });
    } 
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete Course.  Please try again later."
    });
  }
});


/*
 * Route to get list of students in specific course.
 */
router.get('/:id/students', async(req, res) => {
  try {
    const course = await getCourseEnrollment(req.params.id);
    if (course) {
      res.status(200).send({enrolled: course.enrolled});
    } else {
      res.status(404).send({
        error: "Specified Course id not found."
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch course list.  Please try again later."
    });
  }
});


/*
 * Route to update enrollment for specific course.
 */
router.post('/:id/students', async(req, res) => {
  try {
    await updateEnrollment(req.params.id, req.body);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error inserting course into DB.  Please try again later."
    });
  }
});


/*
 * Route to fetch CSV file containing list of students for specific course.
 */
router.get('/:id/roster', async(req, res, next) => {
  try {
    const course = await getEnrollmentCSV(req.params.id);
    if (course) {
      res.status(200).send(course);
    } else {
      res.status(404).send({
        error: "Specified Course id not found."
      });
    } 
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch Course.  Please try again later."
    });
  }
});


/*
 * Route to get list of assignments for specific course.
 */
router.get('/:id/assignments', async(req, res) => {
  try {
    const course = await getCourseAssignments(req.params.id);
    if (course) {
      res.status(200).send({assignments: course.assignments});
    } else {
      res.status(404).send({
        error: "Specified Course id not found."
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch course list.  Please try again later."
    });
  }
});

module.exports = router;
