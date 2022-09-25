const asyncHandler = require('express-async-handler');
const Snippet = require('../models/SnippetModel');
const mongoose = require('mongoose');

// @desc    Ceatres a Snippet
// @route   post /api/snippets
// @access  Private
const CreateSnippet = asyncHandler(async (req, res) => {
    const {title, description, code} = req.body
    if(!title || !description || !code){
        return res.json({error: 'Please add all fields'})
    }
    const snippet = await Snippet.create({
        auther: req.user.id,
        title,
        description,
        code
    })
    if(!snippet){
        return res.json({error: 'snippet wasnt created'})
    }
    res.status(200).json({
        _id: snippet.id,
        auther: user.auther,
    })
})

// @desc    get a snippet
// @route   get /api/snippet/get-one/:id
// @access  Private
const getASnippet = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {auther, title, description, code} = await Snippet.findById(id)
    return res.status(200).send({
        auther,
        title,
        description,
        code,
    })
})

// @desc    get all the snippets that the user own
// @route   get /api/snippets/get-mine
// @access  Private
const getMine = asyncHandler(async (req, res) => {
    const snippets = await Snippet.find(
        {
            auther: req.user.id,
        }
    )
    if (snippets) return res.status(200).send({snippets})
    else return res.status(404).send({error: 'User Havent created a snippet yet.'})
})

// @desc    delete all the snippets that the user own
// @route   delete /api/snippets/delete-mine
// @access  Private
const deleteMine = asyncHandler(async (req, res) => {
    console.log(req.user.id);
    await Snippet.deleteMany({
        auther: req.user.id,
    })
    return res.status(200).send({
        message: "All snippets deleted successfully.",
    })
})

// @desc    delete a snippets that the user own
// @route   delete /api/snippets/delete-snippet
// @access  Private
const deleteASnippet = asyncHandler(async (req, res) => {
    const {id} = req.body
    console.log(id, req.body);
    await Snippet.findByIdAndDelete(id)

    return res.status(200).send({
        message: "Snippet deleted successfully.",
    })
})

module.exports = {
    getASnippet,
    CreateSnippet,
    getMine,
    deleteMine,
    deleteASnippet,
}