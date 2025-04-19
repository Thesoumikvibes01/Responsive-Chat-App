import {Router} from "express";
import   {verifyToken}  from "../middlewares/authMiddleware.js"
import { searchContacts } from "../controllers/ContactControllers.js";
const contactRoutes = Router();
export default contactRoutes.post("/search",verifyToken,searchContacts)