import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const homePageSchema = new Schema({
    firstsection_title: String,
    firstsection_content: String,
    nutshell_title: String,
    nutshell_content: String,
    focus_title: String,
    focus_content: String, 
    knowledge_title: String, 
    knowledge_content: String,
    last_title: String, 
    last_content: String
}, {timestamps: true});

module.exports = mongoose.model('Homepage', homePageSchema);