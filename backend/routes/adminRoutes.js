const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");

router.get("/pending", authenticateAdmin, blogController.pending);

router.post("/approve", authenticateAdmin, blogController.approve);

router.post("/reject", authenticateAdmin, blogController.reject);

router.post("/delete", authenticateAdmin, blogController.delete);

module.exports = router;
