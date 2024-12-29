
import { Host } from "@/utils/constant.js";
import axios from "axios";

export const apiClient = axios.create({
    baseURL:Host
})