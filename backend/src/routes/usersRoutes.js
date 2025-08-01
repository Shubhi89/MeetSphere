import { Router } from "express";
import { addToHistory, signIn, signUp, getUserHistory } from "../controllers/userController.js";

const router = Router();

router.route("/signin").post(signIn);
router.route("/signup").post(signUp);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);

export default router;