import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql2 from 'mysql2';

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Function to connect to the database
function connectToDatabase() {
  const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'poonamstorage'  // Replace with your database name
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to the database as id', connection.threadId);
  });

  return connection; // Return the connection object to use for queries
}

// Call the function when needed
const dbConnection = connectToDatabase();

// CREATE a new user and insert into the MySQL database
app.post('/users', (req, res) => {
  const newUser = {
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,  // Primary Key
    email: req.body.email
  };

  // MySQL query to insert the user into the database
  const query = 'INSERT INTO krishna (name, address, phone_number, email) VALUES (?, ?, ?, ?)';
  const values = [newUser.name, newUser.address, newUser.phone_number, newUser.email];

  dbConnection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting user into the database:', err.message);
      return res.status(500).send({ message: 'Error inserting user' });
    }
    console.log('User added to the database with phone_number:', newUser.phone_number);
    res.status(201).send(newUser);
  });
});

// READ a specific user by phone_number from MySQL
app.get('/users/:phone_number', (req, res) => {
  const phone_number = req.params.phone_number;

  const query = 'SELECT * FROM krishna WHERE phone_number = ?';
  dbConnection.query(query, [phone_number], (err, results) => {
    if (err) {
      console.error('Error fetching user from the database:', err.message);
      return res.status(500).send({ message: 'Error fetching user' });
    }
    if (results.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(results[0]);
  });
});

// UPDATE a user by phone_numberata
app.patch('/users/:phone_number', (req, res) => {

  const phone_number = req.params.phone_number;
  const { name, address, email } = req.body;

  const query = 'UPDATE krishna SET name = ?, address = ?, email = ? WHERE phone_number = ?';
  const values = [name, address, email, phone_number];

  dbConnection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating user in the database:', err.message);
      return res.status(500).send({ message: 'Error updating user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User updated successfully' });
  });
});

// DELETE a user by phone_number
app.delete('/users/:phone_number', (req, res) => {
  const phone_number = req.params.phone_number;

  const query = 'DELETE FROM krishna WHERE phone_number = ?';
  dbConnection.query(query, [phone_number], (err, result) => {
    if (err) {
      console.error('Error deleting user from the database:', err.message);
      return res.status(500).send({ message: 'Error deleting user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User deleted successfully' });
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
