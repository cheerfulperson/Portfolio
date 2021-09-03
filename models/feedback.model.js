const 
    { v1 : createId } = require('uuid'),
    mongoose = require('mongoose');

// установка модель
const feedbackScheme = new mongoose.Schema(
    {
        id: String,
        name: String,
        social: Object,
        text: String,
    }, 
    {versionKey: false} 
);

const Feedback = mongoose.model("Feedback", feedbackScheme);

module.exports = Feedback;