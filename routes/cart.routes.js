import express from "express";

const cartRoutes = express.Router();

// ROUTES   --------------------------------
cartRoutes.get('/', function (req, res) {res.json({userId: req.user.userId})});
cartRoutes.post('/', function (req, res) {res.json({userId: req.user.userId})});
cartRoutes.put('/:cartItemId', function (req, res) {res.json({cartItemId: req.params.cartItemId,})});
cartRoutes.delete('/:cartItemId', function (req, res) {res.json({cartItemId: req.params.cartItemId,})});


export { cartRoutes };