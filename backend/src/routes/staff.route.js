import express from "express";
import { createStaff } from "../controllers/staff.controller.js";   

const router = express.Router();

// POST /api/staff - Create a new staff member
router.post("/", createStaff);

export default router;