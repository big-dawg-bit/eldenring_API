import db from '../config/database.js';

export const getAllNews = (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';

    let query = 'SELECT * FROM news';
    let countQuery = 'SELECT COUNT(*) as total FROM news';
    const params = [];

    if (search) {
        query += ' WHERE title LIKE ? OR content LIKE ?';
        countQuery += ' WHERE title LIKE ? OR content LIKE ?';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
    }

    query += ' ORDER BY publication_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.get(countQuery, search ? [`%${search}%`, `%${search}%`] : [], (err, count) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        db.all(query, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err.message });
            }

            res.json({
                data: rows,
                pagination: {
                    total: count.total,
                    limit,
                    offset,
                    hasMore: offset + limit < count.total
                }
            });
        });
    });
};

export const getNewsById = (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json(row);
    });
};

export const createNews = (req, res) => {
    const { title, content, publication_date, user_id } = req.body;

    const pubDate = publication_date || new Date().toISOString();

    const query = `
        INSERT INTO news (user_id, title, content, publication_date, image, created_at, updated_at)
        VALUES (?, ?, ?, ?, NULL, datetime('now'), datetime('now'))
    `;

    db.run(query, [user_id, title, content, pubDate], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        res.status(201).json({
            message: 'News created successfully',
            id: this.lastID,
            news: { id: this.lastID, user_id, title, content, publication_date: pubDate }
        });
    });
};

export const updateNews = (req, res) => {
    const { id } = req.params;
    const { title, content, publication_date } = req.body;

    const query = `
        UPDATE news 
        SET title = ?, content = ?, publication_date = ?, updated_at = datetime('now')
        WHERE id = ?
    `;

    db.run(query, [title, content, publication_date, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json({
            message: 'News updated successfully',
            news: { id, title, content, publication_date }
        });
    });
};

export const deleteNews = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json({ message: 'News deleted successfully' });
    });
};