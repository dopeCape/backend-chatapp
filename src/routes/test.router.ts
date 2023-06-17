import { Router } from "express";

let testRouter = Router();
testRouter.get("/test", (req, res) => {
  res.json("it works!!");
});

export { testRouter };
