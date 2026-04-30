const pool = require('../db');

exports.getAllQuestions = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM questions ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const userId = req.user.id;
        const authorName = req.user.username;

        const [result] = await pool.query(
            'INSERT INTO questions (title, content, category, user_id, author_name) VALUES (?, ?, ?, ?, ?)',
            [title, content, category, userId, authorName]
        );

        res.status(201).json({ id: result.insertId, title, content, category, author_name: authorName });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;
        const userId = req.user.id;

        // Check ownership
        const [existing] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Question not found' });
        
        console.log('Update Attempt:', { questionOwner: existing[0].user_id, requestUser: userId });
        if (existing[0].user_id != userId) {
            console.log('Update Denied: User ID mismatch');
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await pool.query(
            'UPDATE questions SET title = ?, content = ?, category = ? WHERE id = ?',
            [title, content, category, id]
        );

        res.json({ message: 'Question updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check ownership
        const [existing] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Question not found' });
        
        console.log('Delete Attempt:', { questionOwner: existing[0].user_id, requestUser: userId });
        if (existing[0].user_id != userId) {
            console.log('Delete Denied: User ID mismatch');
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await pool.query('DELETE FROM questions WHERE id = ?', [id]);
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM comments WHERE question_id = ? ORDER BY created_at ASC', [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const authorNameRaw = req.user.username;
        let authorName = authorNameRaw;

        // Fallback for older tokens that might not have username
        if (!authorName) {
            const [users] = await pool.query('SELECT username FROM users WHERE id = ?', [userId]);
            if (users.length > 0) authorName = users[0].username;
            else authorName = 'Unknown User';
        }

        // Verify question exists
        const [existing] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Question not found' });

        const [result] = await pool.query(
            'INSERT INTO comments (question_id, user_id, author_name, content) VALUES (?, ?, ?, ?)',
            [id, userId, authorName, content]
        );

        res.status(201).json({ id: result.insertId, question_id: id, user_id: userId, author_name: authorName, content });
    } catch (err) {
        console.error('Add Comment Error:', err);
        res.status(500).json({ error: err.message });
    }
};
