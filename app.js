//app.js

//ASSIGNMNET 6

// app.js
const express = require('express');
const app = express();
const port = 2000;

// Middlewares
app.use(express.urlencoded({ extended: true }));

const mysql = require("mysql2");

//Using connection to the mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "article",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});


// ROUTES 

//HOMEPAGE
app.get('/', (req, res) => {
  res.send('<h1>Home</h1><a href="/articles">Articles</a>');
});


//  GET ARTICLE PAGE
app.get('/articles', (req, res) => {
  function readRecords() {
    const sql = "SELECT * FROM `article`";
    connection.query(sql, (err, results) => {
      if (!err) {
        res.render("articles.hbs", { data: results });
      } else {
        res.render("database-error.hbs");
      }
    });
  }
  readRecords();
});


// GET /articles/:articleId
app.get('/articles/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  
  const sql = 'SELECT * FROM `article` WHERE `articleId` = ?';
  connection.query(sql, [articleId], (err, results) => {
    if (!err) {
      const article = results[0];
      res.render('article.hbs', { article });
    } else {
      res.render('database-error.hbs');
    }
  });
});


//  GET  adding articles 
app.get('/add-article', (req,res) => {
  res.render("add-articles.hbs");
});


// POST /articles
app.post('/articles', express.urlencoded({ extended: true }), (req, res) => {
  const { articleName, articleContent } = req.body;
  const sql = 'INSERT INTO `article` (`title`, `content`) VALUES (?, ?)';
  connection.query(sql, [articleName, articleContent], (err, results) => {
    if (!err) {
      const newArticleId = results.insertId;
      res.redirect(`/articles/${newArticleId}`);
    } else {
      res.render('database-error.hbs');
    }
  });
});


//GET edit article
app.get('/edit-article/:articleId', (req,res) => {
  const articleId = req.params.articleId;

 
  const sql = 'SELECT * FROM `article` WHERE `articleId` = ?';
  connection.query(sql, [articleId], (err, results) => {
    if (!err) {
      const article = results[0];
      res.render('edit-articleId.hbs', { article });
    } else {
      res.render('database-error.hbs');
    }
  });

});


//POST edit article
app.post('/article/edit', express.urlencoded({ extended: true }), (req, res) => {
  const { articleName, articleContent, articleId } = req.body;
  const sql = 'UPDATE `article` SET `title` = ?, `content` = ? WHERE `articleId` = ?';
  connection.query(sql, [articleName, articleContent, articleId], (err) => {
    if (!err) {
      res.redirect(`/articles/${articleId}`);
    } else {
      res.render('database-error.hbs');
    }
  });
});


//GET delete article
app.get('/delete-article/:articleId' , (req,res) => {
  const articleId = req.params.articleId;

  const sql = 'SELECT * FROM `article` WHERE `articleId` = ?';
  connection.query(sql, [articleId], (err, results) => {
    if (!err) {
      const article = results[0];
      res.render('delete-article.hbs', { article });
    } else {
      res.render('database-error.hbs');
    }
  });
})

// POST /article/delete
app.post('/article/delete', express.urlencoded({ extended: true }), (req, res) => {
  const { articleId } = req.body;
  const sql = 'DELETE FROM `article` WHERE `articleId` = ?';
  connection.query(sql, [articleId], (err) => {
    if (!err) {
      res.redirect('/articles');
    } else {
      res.render('database-error.hbs');
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




