const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course.js');

router.get('/', (req, res, next) => {
    Course.find().exec()
        .then(courses => {
            res.json(courses);
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', (req, res, next) => {
    Course.create(req.body)
        .then(post => {
            res.json(post);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;