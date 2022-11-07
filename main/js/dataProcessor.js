// Retrieve data, store in csv file?
// API Key: fbdfdfb1677b79c41f66c0aa9123b210
// Example request: https://api.themoviedb.org/3/movie/550?api_key=fbdfdfb1677b79c41f66c0aa9123b210


// Popular movies


// Top rated movies

// Latest movies

// fetch('https://api.themoviedb.org/3/movie/550?api_key=fbdfdfb1677b79c41f66c0aa9123b210')
//   .then((response) => response.json())
//   .then((data) => console.log(data));

import fetch from "node-fetch"


fetch('https://api.themoviedb.org/3/movie/popular/?api_key=fbdfdfb1677b79c41f66c0aa9123b210')
  .then((response) => response.json())
  .then((data) => console.log(data));
