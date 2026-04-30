const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

router.get('/', questionController.getAllQuestions);
router.post('/', auth, questionController.createQuestion);
router.put('/:id', auth, questionController.updateQuestion);
router.delete('/:id', auth, questionController.deleteQuestion);

router.get('/:id/comments', questionController.getComments);
router.post('/:id/comments', auth, questionController.addComment);

module.exports = router;
