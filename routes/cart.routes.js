import express from "express";

const cartRoutes = express.Router();

// ROUTES   --------------------------------
cartRoutes.get('/:userId', function (req, res) {res.json({userId: req.params.userId})});
cartRoutes.post('/:userId', function (req, res) {res.json({userId: req.params.userId})});
cartRoutes.put('/:userId/:cartItemId', function (req, res) {res.json({cartItemId: req.params.cartItemId, userId: req.params.userId})});
cartRoutes.delete('/:userId/:cartItemId', function (req, res) {res.json({cartItemId: req.params.cartItemId, userId: req.params.userId})});


export { cartRoutes };