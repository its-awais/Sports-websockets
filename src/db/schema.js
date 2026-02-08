import { pgTable, serial, text, timestamp, integer, jsonb, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================
// Enums
// ========================

export const matchStatusEnum = pgEnum('match_status', ['scheduled', 'live', 'finished']);

// ========================
// Tables
// ========================

/**
 * Matches Table
 */
/*  before  you go and read this code understand it that we use id column but when in serial you see id  the differce is that home_team we write in is for db and and its actual column in postgry sql and homeTeam its for javascript so its best becuase we use js and postgry so convention is really helpfull when writing clean code */
export const matchesTable = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: varchar('sport', { length: 50 }).notNull(),
  homeTeam: varchar('home_team', { length: 100 }).notNull(),
  awayTeam: varchar('away_team', { length: 100 }).notNull(),
  status: matchStatusEnum('status').notNull().default('scheduled'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Commentary Table
 */
export const commentaryTable = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .notNull()
    .references(() => matchesTable.id, { onDelete: 'cascade' }),/** so onDelete: 'cascade mean if match is deleted then delete its commentry */ 
  minute: integer('minute'),
  sequence: integer('sequence').notNull(),
  period: varchar('period', { length: 20 }),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  actor: varchar('actor', { length: 100 }).notNull(),
  team: varchar('team', { length: 100 }).notNull(),
  message: text('message').notNull(),
  metadata: jsonb('metadata').$type(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ========================
// Relations
// ========================
/*  relations are used to define the relationship between tables so that we can easily query the related data */
/*  in this case we have one to many relationship between matches and commentary because one match can have many commentary but one commentary can only belong to one match */
/*  so we define the relation in both tables so that we can easily query the related data from both sides */
/* one more thing in many we only use reference to the table and in one we use reference to the table and also specify the fields and references so that we can easily query the related data */
/* in many we just only need to give reference to the table but in one in one we need to give reference to the table and field*/
export const matchesRelations = relations(matchesTable, ({ many }) => ({
  commentary: many(commentaryTable),
}));

export const commentaryRelations = relations(commentaryTable, ({ one }) => ({
  match: one(matchesTable, {
    fields: [commentaryTable.matchId],
    references: [matchesTable.id],
  }),
}));
