import contactController from "../controllers/contact.controller.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { contactSchema } from "../../shared/index.js";

export const router = Router();

router.post("/contact", validate(contactSchema), contactController.sendContactEmail);
