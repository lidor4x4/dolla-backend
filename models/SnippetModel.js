const mongoose = require('mongoose');

const snippetSchema = mongoose.Schema({
    auther:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    
    

},{timestamps: true});

module.exports = mongoose.model('Snippet', snippetSchema);
