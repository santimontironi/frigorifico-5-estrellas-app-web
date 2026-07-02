import contactController from "../controllers/contact.controller.js";
import { Router } from "express";

export const router = Router();

router.post("/contact", contactController.sendContactEmail);
