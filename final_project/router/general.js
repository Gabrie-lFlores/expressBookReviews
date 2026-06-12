const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password
  if(username&& password){
    const alredyRegisted= users.find(user => user.username==username)
     if(alredyRegisted)
      return  res.status(404).json({message: "Username alredy registered"});
    
    users.push({username, password});
      return  res.status(201).json(`{message: ${username} has been registered"}`);
    
  }
  else{
    return res.status(404).json({message: "Username or password weren't provide "})
  }
});

// Get the book list available in the shop  task 1.
public_users.get('/',function (req, res) {
  
  return  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN   Task 2.
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnp=req.params.isbn;
  return res.status(200).json(books[isbnp]);
 });


  
// Get book details based on author. Task 3. 
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  const respSearch=Object.values(books).find(book => book.author==author)
  if(respSearch)
    return res.status(200).json(respSearch);
  else
    return res.status(404).json({message: "Author not found"});
});

// Get all books based on title. Task 4
public_users.get('/title/:title',function (req, res) {
  const title=req.params.title;
  const respSearch=Object.values(books).find(book => book.title==title)
  if(respSearch)
    return res.status(200).json(respSearch);
  else
    return res.status(404).json({message: "Title not found"});
  
});

//  Get book review. Task 5
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn
  return res.status(200).json(books[isbn]);
});

//Complete the code for registering a new user. Task 6

public_users.post('/register', function(req, resp) {
    const { username, password } = req.body;
    if (!username || !password) {
        return resp.status(400).send("Data for register is incomplete");
    }
    // Check if the username already exists
    const userExists = users.some(u => u.username === username);
    if (userExists) {
        return resp.status(400).send("Username already exists");
    }
     //register
    users.push({ username, password });
    return resp.status(201).send(`Register of ${username} was successful`);
});

module.exports.general = public_users;
