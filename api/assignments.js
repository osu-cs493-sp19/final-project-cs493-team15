const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');

const {
    AssignmentSchema,
} = require('../models/assignments');

/*
 * Route to add an assignment.
 */
router.post('/', async (req, res, next) => {

});

/*
 * Route to get specific assignment.
 */
router.get('/:id', async (req, res, next) => {

});

/*
 * Route to update specific assignment.
 */
router.patch('/:id', async (req, res, next) => {

});

/*
 * Route to delete specific assignment.
 */
router.delete('/:id', async (req, res, next) => {

});


/*
 * Route to get all submissions for specific assignment.
 */
router.get('/:id/submissions', async (req, res, next) => {

});

/*
 * Route to add a submission for specific assignment.
 */
router.post('/:id/submissions', async (req, res, next) => {

});

module.exports = router;
