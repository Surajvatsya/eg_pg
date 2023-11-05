const express = require("express")
// const bodyParser = require('body-parser');
// const cors = require('cors');
const pool = require('./db');
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// login -> post
// logout -> get
// signup -> post
// Signup API
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if the user already exists
    const checkQuery = 'SELECT COUNT(*) FROM users WHERE email = $1';
    const checkValues = [email];
  
    pool.query(checkQuery, checkValues, (error, result) => {
      if (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const userCount = parseInt(result.rows[0].count);
  
        if (userCount > 0) {
          res.status(400).json({ error: 'User with this email already exists' });
        } else {
          // If the user does not exist, insert the new user
          const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
          const insertValues = [name, email, password];
  
          pool.query(insertQuery, insertValues, (insertError, insertResult) => {
            if (insertError) {
              console.error('Error inserting user:', insertError);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(201).json({ message: 'User registered successfully' });
            }
          });
        }
      }
    });
  });
  

// Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Check if the user exists in the database
    const checkQuery = 'SELECT * FROM users WHERE email = $1';
    const checkValues = [email];
  
    pool.query(checkQuery, checkValues, (error, result) => {
      if (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const user = result.rows[0]; // Assuming email is unique
  
        if (!user) {
          res.status(401).json({ error: 'User not found' });
        } else {
          // Check if the provided password matches the stored password
          if (user.password === password) {
            // Passwords match; you may want to consider using a more secure method
            res.status(200).json({ message: 'Login successful' });
          } else {
            res.status(401).json({ error: 'Invalid password' });
          }
        }
      }
    });
  });
  
  
  
app.get('/get-data', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.json(result.rows);
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });