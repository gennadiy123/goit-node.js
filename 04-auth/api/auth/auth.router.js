import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/auth/register",
  authController.validateRegister,
  authController.register
);

router.put("/auth/login", authController.validateLogin, authController.login);

router.put("/auth/logout", authController.authorization, authController.logout);

router.get("/users/current", authController.authorization, authController.current);

export const authRouter = router;
