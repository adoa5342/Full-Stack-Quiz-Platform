const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionActive,
  bulkImportQuestions,
} = require("../controllers/admin.controller");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/questions", getQuestions);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.put("/questions/:id/toggle", toggleQuestionActive);
router.post("/questions/import", bulkImportQuestions);

module.exports = router;