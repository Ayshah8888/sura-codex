import { Router, type IRouter } from "express";
import healthRouter from "./health";
import essaysRouter from "./essays";
import novelsRouter from "./novels";
import statsRouter from "./stats";
import featuredRouter from "./featured";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/essays", essaysRouter);
router.use("/novels", novelsRouter);
router.use("/stats", statsRouter);
router.use("/featured", featuredRouter);

export default router;
