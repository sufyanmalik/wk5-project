//import modules
import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

//instantiate app
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//looks for .env file pulls those env variables into node process
dotenv.config();

//express app connects to db using pool.
const db = new pg.Pool({
  connectionString: process.env.DB_CONN,
});

//root route
app.get("/", (req, res) => res.json(`Helloooooo ( ͡° ͜ °)`));

app.get("/jokes", async (req, res) => {
  const result = await db.query(`SELECT * FROM jokes`);
  const jokes = result.rows;
  console.log(result);
  res.json(jokes);
});

//route to add jokes to the database
app.post("/jokes", async (req, res) => {
  const jokeFromClient = req.body.joke;
  const punchLineFromClient = req.body.punchline;

  // Ensure the data is inserted correctly
  const result = await db.query(
    `INSERT INTO jokes (joke, punchline) VALUES ($1, $2) RETURNING *`,
    [jokeFromClient, punchLineFromClient]
  );

  // Return the entire joke data, including the ID and the joke/punchline
  res.json(result.rows[0]);
});

//delete route
app.delete("/jokes/:id", async (req, res) => {
  console.log(req.params.id);
  const deleted = await db.query(`DELETE FROM jokes WHERE id = $1`, [
    req.params.id,
  ]);
  res.send(req.params.id);
});

app.listen("4242", () => {
  console.log(`App running on http://localhost:4242`);
});
