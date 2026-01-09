import db from '../config/database.js';

export const getAllBosses = (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    const difficulty = req.query.difficulty ? parseInt(req.query.difficulty) : null;

    let query = 'SELECT * FROM bosses';
    let countQuery = 'SELECT COUNT(*) as total FROM bosses';
    const params = [];
    const conditions = [];

    if (search) {
        conditions.push('(name LIKE ? OR location LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    if (difficulty && difficulty >= 1 && difficulty <= 5) {
        conditions.push('difficulty = ?');
        params.push(difficulty);
    }

    if (conditions.length > 0) {
        const whereClause = ' WHERE ' + conditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
    }

    query += ' ORDER BY "order" ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const countParams = params.slice(0, -2);
    
    db.get(countQuery, countParams, (err, count) => {
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
                },
                filters: {
                    search: search || null,
                    difficulty: difficulty || null
                }
            });
        });
    });
};

export const getBossById = (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM bosses WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'Boss not found' });
        }

        res.json(row);
    });
};

export const createBoss = (req, res) => {
    const { name, title, description, location, difficulty, health, drops, order } = req.body;

    const query = `
        INSERT INTO bosses (name, title, description, location, difficulty, health, drops, "order", image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
    `;

    db.run(query, [name, title, description, location, difficulty, health, drops, order || 0], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        res.status(201).json({
            message: 'Boss created successfully',
            id: this.lastID,
            boss: { id: this.lastID, name, title, description, location, difficulty, health, drops, order: order || 0 }
        });
    });
};

export const updateBoss = (req, res) => {
    const { id } = req.params;
    const { name, title, description, location, difficulty, health, drops, order } = req.body;

    const query = `
        UPDATE bosses 
        SET name = ?, title = ?, description = ?, location = ?, difficulty = ?, health = ?, drops = ?, "order" = ?
        WHERE id = ?
    `;

    db.run(query, [name, title, description, location, difficulty, health, drops, order || 0, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Boss not found' });
        }

        res.json({
            message: 'Boss updated successfully',
            boss: { id, name, title, description, location, difficulty, health, drops, order: order || 0 }
        });
    });
};

export const deleteBoss = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM bosses WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Boss not found' });
        }

        res.json({ message: 'Boss deleted successfully' });
    });
};