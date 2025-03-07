const { response } = require("express");
const express = require("express");
const pgp = require("pg-promise")();
const db = pgp("postgres://hyeeumfv:1YwH3PINc4cZLU1YqnL2Lix1AtNwci7s@queenie.db.elephantsql.com:5432/hyeeumfv");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get('/users', async (req, res) => {
  const users = await db.any("SELECT * FROM users").then((users) => {
    return users;
  })
  res.send(users);
})

app.post('/users', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  await db.none(`INSERT INTO users (name, email) VALUES ($1, $2);`, [name, email])
  res.send('user created');
})

app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;

  await db.none(`UPDATE users SET name = $1, email = $2 WHERE id= $3`, [name, email, id]);

  res.send('user updated');
})

app.get('/comments', async (req, res) => {
  const comments = await db.any("SELECT * FROM comments").then((comments) => {
    return comments;
  })
  res.send(comments);
})

app.post('/comments', async (req, res) => {
  const comment = req.body.comment;
  
  await db.any(`INSERT INTO comments (comment) VALUES ($1);`, [comment])
  res.send('comment created');
})

app.put('/comments/:id', async (req, res) => {
  const id = req.params.id;
  const comment = req.body.comment;

  await db.none(`UPDATE comments SET comment = $1 WHERE id= $2`, [comment, id]);

  res.send('comment updated');
})


app.get('/users/comments', async (req, res) => {
  const id = req.body.id;
  const comments = await db.any('SELECT comment FROM comments WHERE user_id = $1', [id]).then((comments) =>{
    return comments;
  });
  res.send(comments);
})

app.listen(PORT, () => {
  console.log(`LikeyPix API is running on port ${PORT}`);
});
