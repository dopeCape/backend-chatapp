import { Response } from "express";
import { createWrokspace } from "../modules/workspace.module";

async function handleCreateWorkSpace(req, res: Response, next) {
  try {
    let workspace = {
      name: req.body.name,
    };
    let userId = req.body.userid;
    let chatWorkSpaceId = req.body.id;

    let { workspace_, groupChat, chatWorkSpace_ } = await createWrokspace(
      workspace,
      chatWorkSpaceId,
      userId
    );
    res.status(201).send({ workspace_, groupChat, chatWorkSpace_ });
  } catch (error) {
    if (error.code == "P2002") {
      res.send({ workspace_: "P2002" });
    }

    // next(error);
  }
}

export { handleCreateWorkSpace };
