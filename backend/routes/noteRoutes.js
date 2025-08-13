const express = require('express');
const {
  createNote,
  getUserNotes,
  deleteNote,
  updateNote,
  shareNote,
} = require('../controllers/noteController');

const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createNote);
router.get('/', authMiddleware, getUserNotes);
router.delete('/:id', authMiddleware, deleteNote);
router.put('/:id', authMiddleware, updateNote);
router.post('/:id/share', authMiddleware, shareNote);

module.exports = router;
