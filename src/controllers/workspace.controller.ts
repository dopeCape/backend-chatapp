import { Response } from "express";
import { createWrokspace, upadteWorksSpace } from "../modules/workspace.module";
import { updateWorkspace } from "../services/ably.service";

async function handleCreateWorkSpace(req, res: Response, next) {
  try {
    let workspace = {
      name: req.body.name,
      topic: req.body.topic,
      description: req.body.description,
      profilePic: req.body.profilePic,
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
    console.log(error);
    // next(error);
  }
}
async function handleUpdateWorkspace(req, res, next) {
  try {
    let workspace = {
      name: req.body.name,
      description: req.body.description,
      topic: req.body.topic,
      profilePic: req.body.profilePic,
    };

    console.log(workspace);
    let worksapce_ = await upadteWorksSpace(req.body.id, workspace);

    await Promise.all(
      worksapce_.chatWorkSpace.map(async (user) => {
        await updateWorkspace(user.user.id, worksapce_.id, workspace);
      })
    );
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
}
export { handleCreateWorkSpace, handleUpdateWorkspace };
