import express from "express";
import {  changePassword, deleteUserPermanently, getAllUsersAsAdmin, signin, signup, updateUser } from "../controllers/auth.js";
import { createReview, deleteReview, getReviewById, getReviews, updateReview } from "../controllers/review.js";
import { checkAuthenticatedUser, checkPermission, checkUserPermission } from "../middlewares/checkPermission.js";

const routerAuth = express.Router();

routerAuth.post("/register", signup);
routerAuth.post("/login", signin);

routerAuth.get("/users",checkPermission, getAllUsersAsAdmin);
routerAuth.patch("/user/:id/update", updateUser);
routerAuth.delete("/users/:id",checkPermission, deleteUserPermanently);
routerAuth.post("/user/change/password",checkAuthenticatedUser, changePassword);



routerAuth.get("/reviews", getReviews);

routerAuth.get("/review/:id", getReviewById);

routerAuth.post("/review", checkAuthenticatedUser, createReview);

routerAuth.put("/review/:id", checkAuthenticatedUser, updateReview);

routerAuth.delete("/review/:id", checkPermission, deleteReview);


export default routerAuth;
