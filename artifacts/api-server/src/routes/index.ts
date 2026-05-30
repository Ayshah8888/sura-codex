import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import storageRouter from "./storage";
import essaysRouter from "./essays";
import novelsRouter from "./novels";
import statsRouter from "./stats";
import featuredRouter from "./featured";
import commentsRouter from "./comments";
import likesRouter from "./likes";
import sharesRouter from "./shares";
import usersRouter from "./users";
import notificationsRouter from "./notifications";
import analyticsRouter from "./analytics";
import archiveRouter from "./archive";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(storageRouter);
router.use("/essays", essaysRouter);
router.use("/novels", novelsRouter);
router.use("/stats", statsRouter);
router.use("/featured", featuredRouter);
router.use("/comments", commentsRouter);
router.use("/likes", likesRouter);
router.use("/shares", sharesRouter);
router.use("/users", usersRouter);
router.use("/notifications", notificationsRouter);
router.use("/analytics", analyticsRouter);
router.use("/archive", archiveRouter);

export default router;
