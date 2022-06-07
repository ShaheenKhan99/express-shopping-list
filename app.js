const express = require('express');
const app = express();
const itemsRoutes = require('./routes/items');
const ExpressError = require('./expressError');

app.use(express.json());
app.use('/items', itemsRoutes);



// 404 error handler
app.use((req, res, next) => {
  return new ExpressError("Not Found", 404);
})

// general error handler
app.use((err, req, res, next) => {
// the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  //set the status and alert the user
  return res.status(status).json({
    error: { 
      message: message, 
      status: status 
    }
  });
});



module.exports = app;