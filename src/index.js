import express from 'express';
import { eq, desc } from 'drizzle-orm';
import { db, pool } from './db/db.js';
import { matchesTable, commentaryTable } from './db/schema.js';

const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

// ========================
// Health Check
// ========================

app.get('/', (req, res) => {
  res.json({ message: 'Sports WebSocket Server is running! 🏆' });
});

// ========================
// Matches Routes
// ========================

/**
 * GET /matches - Get all matches
 * Optional query: ?status=live&sport=football
 */
app.get('/matches', async (req, res) => {
  try {
    const { status, sport } = req.query;
    let query = db.select().from(matchesTable);

    if (status) query = query.where(eq(matchesTable.status, status));
    if (sport) query = query.where(eq(matchesTable.sport, sport));

    const matches = await query;
    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /matches/:id - Get a specific match
 */
app.get('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await db
      .select()
      .from(matchesTable)
      .where(eq(matchesTable.id, parseInt(id)));

    if (!match.length) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }

    res.json({ success: true, data: match[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /matches - Create a new match
 * Body: { sport, homeTeam, awayTeam, startTime }
 */
app.post('/matches', async (req, res) => {
  try {
    const { sport, homeTeam, awayTeam, startTime } = req.body;

    if (!sport || !homeTeam || !awayTeam || !startTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sport, homeTeam, awayTeam, startTime',
      });
    }

    const [newMatch] = await db
      .insert(matchesTable)
      .values({
        sport,
        homeTeam,
        awayTeam,
        startTime: new Date(startTime),
        status: 'scheduled',
      })
      .returning();

    res.status(201).json({ success: true, data: newMatch });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PUT /matches/:id - Update a match
 * Body: { status, homeScore, awayScore, endTime }
 */
app.put('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, homeScore, awayScore, endTime } = req.body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (homeScore !== undefined) updateData.homeScore = homeScore;
    if (awayScore !== undefined) updateData.awayScore = awayScore;
    if (endTime !== undefined) updateData.endTime = new Date(endTime);

    const [updatedMatch] = await db
      .update(matchesTable)
      .set(updateData)
      .where(eq(matchesTable.id, parseInt(id)))
      .returning();

    if (!updatedMatch) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }

    res.json({ success: true, data: updatedMatch });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /matches/:id - Delete a match
 */
app.delete('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(matchesTable).where(eq(matchesTable.id, parseInt(id)));

    res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ========================
// Commentary Routes
// ========================

/**
 * GET /matches/:matchId/commentary - Get all commentary for a match
 */
app.get('/matches/:matchId/commentary', async (req, res) => {
  try {
    const { matchId } = req.params;

    const commentary = await db
      .select()
      .from(commentaryTable)
      .where(eq(commentaryTable.matchId, parseInt(matchId)))
      .orderBy(desc(commentaryTable.createdAt));

    res.json({ success: true, data: commentary });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /matches/:matchId/commentary - Add commentary to a match
 * Body: { minute, sequence, period, eventType, actor, team, message, metadata?, tags? }
 */
app.post('/matches/:matchId/commentary', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { minute, sequence, period, eventType, actor, team, message, metadata, tags } = req.body;

    if (!sequence || !eventType || !actor || !team || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sequence, eventType, actor, team, message',
      });
    }

    const [newCommentary] = await db
      .insert(commentaryTable)
      .values({
        matchId: parseInt(matchId),
        minute: minute || null,
        sequence,
        period: period || null,
        eventType,
        actor,
        team,
        message,
        metadata: metadata || null,
        tags: tags || [],
      })
      .returning();

    res.status(201).json({ success: true, data: newCommentary });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PUT /commentary/:id - Update commentary
 * Body: { message, metadata? }
 */
app.put('/commentary/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, metadata } = req.body;

    const updateData = {};
    if (message !== undefined) updateData.message = message;
    if (metadata !== undefined) updateData.metadata = metadata;

    const [updatedCommentary] = await db
      .update(commentaryTable)
      .set(updateData)
      .where(eq(commentaryTable.id, parseInt(id)))
      .returning();

    if (!updatedCommentary) {
      return res.status(404).json({ success: false, error: 'Commentary not found' });
    }

    res.json({ success: true, data: updatedCommentary });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /commentary/:id - Delete commentary
 */
app.delete('/commentary/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(commentaryTable).where(eq(commentaryTable.id, parseInt(id)));

    res.json({ success: true, message: 'Commentary deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ========================
// Error Handling
// ========================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ========================
// Server Start
// ========================

app.listen(PORT, () => {
  console.log(`🏆 Sports WebSocket Server is running on port ${PORT}`);
  console.log(`📡 Database connected` );
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nClosing database pool...');
  await pool.end();
  process.exit(0);
});
