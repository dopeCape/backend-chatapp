import { getGroupChatCollection } from "../config/db.config";

async function getGroupChatData(groupId) {
  try {
    let collection = await getGroupChatCollection();

    let groupChat = await collection.findOne({ groupId: groupId });
    return groupChat;
  } catch (error) {
    throw error;
  }
}

async function createGroupChat(groupChat) {
  try {
    let collection = await getGroupChatCollection();
    let newGroupChat = await collection.create(groupChat);
    return newGroupChat;
  } catch (error) {
    throw error;
  }
}

async function addMemberToGroup(groupId, user) {
  try {
    let collection = await getGroupChatCollection();
    let groupChat = await collection.findOne({ groupId: groupId });
    groupChat.Members.push(user);
    let updatedGroup = await collection.findOneAndUpdate(
      { groupId: groupId },
      groupChat
    );

    return updatedGroup;
  } catch (error) {
    throw error;
  }
}

async function removeMemeberFromGroup(groupId, userId) {
  try {
    let collection = await getGroupChatCollection();
    let groupChat = await collection.findOne({ groupId: groupId });
    let newGroupChat = groupChat.Members.filter((x) => {
      return x.userId != userId;
    });
    let updatedGroupChat_ = await collection.findOneAndUpdate(
      { groupId: groupId },
      newGroupChat
    );
    return updatedGroupChat_;
  } catch (error) {
    throw error;
  }
}

export {
  removeMemeberFromGroup,
  addMemberToGroup,
  createGroupChat,
  getGroupChatData,
};
