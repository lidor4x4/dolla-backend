const express = require("express");
const router = express.Router();
const {CreateSnippet, getASnippet, getMine, deleteMine, deleteASnippet } = require("../controllers/SnippetController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, CreateSnippet);
router.get("/get-a-snippet/:id", protect, getASnippet)
router.get("/get-mine", protect, getMine)
router.delete("/delete-mine", protect, deleteMine)
router.delete("/delete-snippet", protect, deleteASnippet)



module.exports = router;
