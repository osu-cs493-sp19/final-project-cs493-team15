const AssignmentSchema = {
    description: { required: true },
    courseId: { required: true },
    title: { required: true},
    points: { required: true},
    due: { required: true}
  };
  exports.AssignmentSchema = AssignmentSchema;