const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


//Task 6
public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password
  if(username&& password){
    const alredyRegisted= users.find(user => user.username==username)
     if(alredyRegisted)
      return  res.status(404).json({message: "Username alredy registered"});
    
    users.push({username, password});
      return res.status(201).json({ message: `${username} has been registered` });
    
  }
  else{
    return res.status(404).json({message: "Username or password weren't provide "})
  }
});

// Get the book list available in the shop  task 1.
public_users.get('/',function (req, res) {
  
  return  res.send(JSON.stringify({books}, null, 4));
});

// task 10. 
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books);
    res.status(200).json(allBooks);
  } catch(error) {
    res.status(500).json({ message: error });
  }
});

// Get book details based on ISBN   Task 2.
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnp=req.params.isbn;
  return res.status(200).json(books[isbnp]);
 });

 // task 11
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    res.status(200).json(book);
  } catch(error) {
    res.status(404).json({ message: error });
  }
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

module.exports.general = public_users;
