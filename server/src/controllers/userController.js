import { findUserById } from "../services/userService.js";

export async function getMe(req, res, next) {
  try {
    const user = await findUserById(req.user.userId);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}