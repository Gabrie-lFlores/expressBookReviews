const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login.  Task 7
regd_users.post("/login", (req,res) => {
  const username= req.body.username;
  const password= req.body.password;
  // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign( {data: password }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = { accessToken, username};
        console.log(req.session);
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review. Task 8
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization) {
    return res.status(401).json({message: "User not logged in"});
  }
  const username = req.session.authorization.username;
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (!review) {
    return res.status(400).json({message: "Review content is missing"});
  }
  books[isbn].reviews[username] = review;
   return res.status(200).json(books[isbn].reviews);

});
//Delete review Task 9
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;         
    const username = req.session.authorization ? req.session.authorization['username'] : (req.user ? req.user.username : null);

    if (!username) {
        return res.status(403).json({ message: "User not logged in or authenticated" });
    }

    // Verificar si el libro existe en tu base de datos de libros 
    if (books[isbn]) {
        let bookReviews = books[isbn].reviews;
        // Comprobar si este usuario específico dejó una reseña en este libro
        if (bookReviews && bookReviews[username]) {
            // Eliminar la reseña 
            delete bookReviews[username];            
            return res.status(200).json({ message: `Review for ISBN ${isbn} deleted`});
        } else {
            return res.status(404).json({ message: "No review found for this user on this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users
module.exports.isValid = isValid;
module.exports.users = users;
