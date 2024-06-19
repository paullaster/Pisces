import express from "express";

const cartRoutes = express.Router();

// ROUTES   --------------------------------
cartRoutes.get('/:userId', function (req, res) {res.json({userId: req.params.userId})});
cartRoutes.post('/:userId', function (req, res) {res.json({userId: req.params.userId})});
cartRoutes.put('/:cartItemId', function (req, res) {res.json({cartItemId: req.params.cartItemId,})});
cartRoutes.delete('/:cartItemId', function (req, res) {res.json({cartItemId: req.params.cartItemId,})});


export { cartRoutes };