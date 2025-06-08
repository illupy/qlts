import express from "express";
import unitController from "../controller/UnitController";

const router = express.Router();

// GET all units
router.get("/all", unitController.getAllUnits);
router.post("/", unitController.createUnit);

export default router;
