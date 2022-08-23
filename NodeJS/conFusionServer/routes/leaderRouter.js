const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Lead = require('../models/leaders');


const leaderRouter = express.Router();

leaderRouter.route("/")
.get((req,res,next) => {
    Lead.find({})
    .then((lead) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Lead.create(req.body)
    .then((lead) => {
        console.log('Leader Created ', lead);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Leaders');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Lead.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
   Lead.findById(req.params.leaderId)
   .then((lead) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(lead);
}, (err) => next(err))
.catch((err) => next(err));
})

.post( authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leader/'+ req.params.leaderId);
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Lead.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((lead) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Lead.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;

