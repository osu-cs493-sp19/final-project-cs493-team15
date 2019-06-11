const router = require('express').Router();
const { ObjectId } = require('mongodb');


const { validateAgainstSchema } = require('../lib/validation');
const {
    AssignmentSchema,
    SubmissionSchema,
    insertNewAssignment,
    getAssignmentsByID,
    updateAssignmentByID,
    deleteAssignmentByID,
    getSubmissionsByID,
    insertNewSubmission,
    getAssignmentsPage
 } = require('../models/assignments');

 const {
    getCourseById,
    checkProperInstructor
 } = require('../models/courses')

 const { generateAuthToken, requireAuthentication } = require('../lib/auth');


 router.get('/', async (req, res) => {
    try {
      const assignmentsPage = await getAssignmentsPage(parseInt(req.query.page) || 1);
      res.status(200).send(assignmentsPage);
    } catch (err) {
      res.status(500).send({
        error: "Error fetching lodgings.  Try again later."
      });
    }
  });

/*
 * Route to add an assignment.
 */
router.post('/', requireAuthentication, async (req, res, next) => {
    if (validateAgainstSchema(req.body, AssignmentSchema)) {
        if (req.role == "admin" || (req.role == "instructor" && await checkProperInstructor(req.body.courseId, req.user))) {
            try {
            const id = await insertNewAssignment(req.body);
            res.status(201).send({
            id: id
            });
            } catch (err) {
                console.error(err);
                res.status(500).send({
                error: "Error inserting assignment into DB.  Please try again later."
                });
            }
        } else {
            res.status(403).send({
                error: "Unauthorized to access the specified resource"
            });
        }  
    } else {
        res.status(400).send({
            error: "Request body is not a valid assignment object."
        });
    }
});

/*
 * Route to get specific assignment.
 */
router.get('/:id', async (req, res, next) => {
    try {
        const assignment = await getAssignmentsByID(req.params.id);
        if(assignment) {
            res.status(200).send({assignment});
        } else {
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
        error: "Unable to fetch assignment.  Please try again later."
        });
    } 
});

/*
 * Route to update specific assignment.
 */
router.patch('/:id', requireAuthentication, async (req, res, next) => {
    const assignment = await getAssignmentsByID(req.params.id);
    if (req.role == "admin" || (req.role == "instructor" && await checkProperInstructor(assignment.courseId, req.user))) {
        if (validateAgainstSchema(req.body, AssignmentSchema)) {
            try {
                const updateSuccessful = await updateAssignmentByID(req.params.id, req.body);
                if (updateSuccessful) {
                    res.status(200).send({});
                } else {
                    next();
                }
            } catch (err) {
                console.error(err);
                res.status(500).send({
                    error: "Unable to update assignment."
                });
            }
        } else {
            res.status(400).send({
                err: "Request body does not contain a valid assignment."
            });
        }
    } else {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    }           
});

/*
 * Route to delete specific assignment.
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
    const assignment = await getAssignmentsByID(req.params.id);
    if (req.role == "admin" || (req.role == "instructor" && await checkProperInstructor(assignment.courseId, req.user))) {
        try {
            const deleteSuccessful = await deleteAssignmentByID(req.params.id);
            if (deleteSuccessful) {
                res.status(204).end();
            } else {
                next();
            }
        } catch (err) {
            res.status(500).send({
                error: "Unable to delete assignment."
            });
        }
    } else {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    }
      
});

/*
 * Route to get all submissions for specific assignment.
 */
router.get('/:id/submissions', requireAuthentication, async (req, res, next) => {
    const assignment = await getAssignmentsByID(req.params.id);
    if (req.role == "admin" || (req.role == "instructor" && await checkProperInstructor(assignment.courseId, req.user))) {
        try {
            const submissions = await getSubmissionsByID(req.params.id, parseInt(req.query.page) || 1);
            res.status(200).send({submissions: submissions});
        } catch (err) {
            console.error(err);
            res.status(500).send({
                error: "Unable to fetch photos.  Please try again later."
            });
        }
    } else {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    }
});

/*
 * Route to add a submission for specific assignment.
 */
router.post('/:id/submissions', requireAuthentication, async (req, res, next) => {
    if (req.role == "student") {
        if (validateAgainstSchema(req.body, SubmissionSchema)) {
            try {
                const id = await insertNewSubmission(req.body, req.params.id);
                res.status(201).send({
                id: id
                });
            } catch (err) {
                console.error(err);
                res.status(500).send({
                error: "Error inserting submission into DB.  Please try again later."
                });
            }
        } else {
            res.status(400).send({
                error: "Request body is not a valid submission object."
            });
        }
    } else {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    }
});

module.exports = router;
