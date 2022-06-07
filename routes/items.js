const express = require("express");
const router = express.Router();
const ExpressError = require('../expressError');
const items = require('../fakeDb');

/** GET /items  to render a list of shopping items */
router.get('/', function (req, res, next) {
  try {
    return res.json({ items })
  } catch (e) {
    return next(e);
  }  
});

/** POST /items  to accept JSON data and add it to the shopping list */
router.post('/', function (req, res, next) {
  try {
    if (!req.body.name || !req.body.price) throw new ExpressError("Name/price is required", 400);
    const newItem = { 
      name: req.body.name,
      price: req.body.price 
    }
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    return next (e)
  }
});

/** GET /items/:name  to get name and price of a single item */
router.get('/:name', function (req, res, next) {
  try {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found", 404)
    return res.json({ item: foundItem });
  } catch (e){
    return next (e);
  }  
})

/** PATCH /items/:name  to modify a single item's name or price */
router.patch('/:name', function (req, res, next) {
  try {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) throw new ExpressError("Item not found", 404)
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    return res.json({ updated : foundItem });
  } catch (e) {
    return next (e);
  }  
})

/** DELETE /items/:name  to delete specific item from list */
router.delete('/:name', function (req, res, next) {
  try {
    const foundItem = items.findIndex(item => item.name === req.params.name);
    if (foundItem === -1) throw new ExpressError("Item not found", 404)
    items.splice(foundItem, 1);
    return res.json({ message: "Deleted" });
  } catch (e) {
    return next (e);
  }
})


module.exports = router;