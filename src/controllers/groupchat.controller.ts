import { addMemberToGroup } from "../modules/groupchat.module";
import { createGroupChat } from "../modules/groupchat.module";

async function handleCreateGroupChat(data, channel) {
  try {
    let group = data.group;
    let from_channel = channel;

    let newGroupChat = createGroupChat(group);
    channel.publish("group-created", newGroupChat);
  } catch (error) {
    throw error;
  }
}

async function handleAddUser(data, channel) {
  try {
    let updatedGroup = await addMemberToGroup(data.groupId, data.user);
    channel.pusblish("add-member", { updatedGroup });
  } catch (error) {
    throw error;
  }
}

export { handleCreateGroupChat };
