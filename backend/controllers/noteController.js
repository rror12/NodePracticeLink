const Note = require('../models/Note');

// Create Note
exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const note = new Note({ title, content, userId });
    await note.save();
    res.json({ success: true, message: 'Note created successfully', note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Notes for logged-in user (own + shared)
exports.getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ $or: [ { userId }, { sharedWith: userId } ] }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    // Only owner can delete
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId: userId });

    if (!deletedNote) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this note' });
    }

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Note (owner only)
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;

    // Only owner can update
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: userId },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(403).json({ success: false, message: 'Not allowed to edit this note' });
    }

    res.json({ success: true, message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Share Note with friends (owner only)
exports.shareNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const { shareWithUserIds } = req.body; // array of userIds

    if (!Array.isArray(shareWithUserIds)) {
      return res.status(400).json({ success: false, message: 'shareWithUserIds must be an array' });
    }

    // Only owner can modify shares
    const note = await Note.findOne({ _id: noteId, userId: userId });
    if (!note) {
      return res.status(403).json({ success: false, message: 'Not allowed to share this note' });
    }

    // Add unique userIds to sharedWith
    const uniqueIds = [...new Set(shareWithUserIds.map(String))];
    await Note.updateOne(
      { _id: noteId },
      { $addToSet: { sharedWith: { $each: uniqueIds } } }
    );

    const updated = await Note.findById(noteId);
    res.json({ success: true, message: 'Note shared successfully', note: updated });
  } catch (error) {
    console.error('Error sharing note:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
