import { getMsgCollection, getUserCollection } from "../config/db.config";
import { v4 } from "uuid";

async function getUserData(userId) {
  try {
    let collection = await getUserCollection();
    try {
      let user = await collection.findOne({ userId: userId });
      return user;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function createUser(user) {
  try {
    let collection = await getUserCollection();
    try {
      let newUser = await collection.create(user);
      return newUser;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
async function findUserName(userName) {
  try {
    let collection = await getUserCollection();
    try {
      let user = await collection.findOne({ userName: userName });
      console.log(user);

      return user;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function addFriend(userId, friend) {
  try {
    let collection = await getUserCollection();

    try {
      let user = await collection.findOne({ userId: userId });
      user.friends.push(friend);
      try {
        let updatedUser = await collection.findOneAndUpdate(
          { userId: userId },
          user
        );
        return updatedUser;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function removeFriend(userId, friendUserId) {
  try {
    let collection = await getUserCollection();
    try {
      let user = await collection.findOne({ userId: userId });
      user.friends = user.friends.filter((x) => {
        return x.userId === friendUserId;
      });

      try {
        let updatedUser = await collection.findOneAndUpdate(
          { userId: userId },
          user
        );
        return updatedUser;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function blockFriend(userId, friendUserId) {
  try {
    let collection = await getUserCollection();
    try {
      let user = await collection.findOne({ userId: userId });
      user.friends.forEach((x, i) => {
        if (x.userId === friendUserId) {
          if ((x.blocked = userId)) {
            x.blocked = "";
          } else {
            x.blocked = userId;
          }
        }
      });

      try {
        let updatedUser = await collection.findOneAndUpdate(
          { userId: userId },
          user
        );
        return updatedUser;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function setPending(userId, pendingId) {
  try {
    let collection = await getUserCollection();
    try {
      let user = await collection.findOne({ userId: userId });
      user.friends.forEach((x, i) => {
        if (x.userId === userId) {
          if (x.pending != "") {
            if (pendingId == "rejected") {
              x.blocked = "rejected";
            }
            x.blocked = "accepted";
          } else {
            x.pending = pendingId;
          }
        }
      });

      try {
        let updatedUser = await collection.findOneAndUpdate(
          { userId: userId },
          user
        );
        return updatedUser;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
async function searchUsers(query) {
  console.log(query);

  try {
    let collection = await getUserCollection();
    const searchResults = await collection
      .find({
        $or: [{ userName: { $regex: query, $options: "i" } }],
      })
      .select("userName email userId profilePic");

    return searchResults;
  } catch (error) {
    throw error;
  }
}
async function acceptRequest(from, to, chatId) {
  console.log(chatId);

  try {
    let collection = await getUserCollection();
    let msg_collection = await getMsgCollection();
    try {
      let from_user = await collection.findOne({ userId: from });
      let to_user = await collection.findOne({ userId: to });

      let msg = await msg_collection.findOne({ chatId: chatId });

      console.log(msg);
      if (msg === null) {
        try {
          msg_collection.create({ chatId: chatId, msges: [] });
        } catch (error) {
          throw error;
        }
      }

      from_user.friends.forEach((x) => {
        if (x.userId == to) {
          x.pending = "accepted";
          x.chatId = chatId;
        }
      });

      to_user.friends.forEach((x) => {
        if (x.userId == from) {
          x.pending = "accepted";
          x.chatId = chatId;
        }
      });
      try {
        let user_from_send = await collection.findOneAndUpdate(
          { userId: from },
          from_user
        );

        let user_to_send = await collection.findOneAndUpdate(
          { userId: to },
          to_user
        );
        return [from_user, chatId];
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
async function rejectRequest(from, to) {
  try {
    let collection = await getUserCollection();
    try {
      let from_user = await collection.findOne({ userId: from });
      let to_user = await collection.findOne({ userId: to });

      from_user.friends.forEach((x) => {
        if (x.userId == to) {
          x.pending = "rejected";
        }
      });

      to_user.friends.forEach((x) => {
        if (x.userId == from) {
          x.pending = "rejected";
        }
      });
      try {
        let user_from_send = await collection.findOneAndUpdate(
          { userId: from },
          from_user
        );

        let user_to_send = await collection.findOneAndUpdate(
          { userId: to },
          to_user
        );
        return from_user;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function blockRequest(from, to) {
  try {
    let collection = await getUserCollection();
    try {
      let from_user = await collection.findOne({ userId: from });
      let to_user = await collection.findOne({ userId: to });

      from_user.friends.forEach((x) => {
        if (x.userId == to) {
          x.blocked = from;
        }
      });

      to_user.friends.forEach((x) => {
        if (x.userId == from) {
          x.blocked = from;
        }
      });
      try {
        let user_from_send = await collection.findOneAndUpdate(
          { userId: from },
          from_user
        );

        let user_to_send = await collection.findOneAndUpdate(
          { userId: to },
          to_user
        );
        return to_user;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
async function unBlockRequest(from, to) {
  try {
    let collection = await getUserCollection();
    try {
      let from_user = await collection.findOne({ userId: from });
      let to_user = await collection.findOne({ userId: to });

      from_user.friends.forEach((x) => {
        if (x.userId == to) {
          x.blocked = "";
        }
      });

      to_user.friends.forEach((x) => {
        if (x.userId == from) {
          x.blocked = "";
        }
      });
      try {
        let user_from_send = await collection.findOneAndUpdate(
          { userId: from },
          from_user
        );

        let user_to_send = await collection.findOneAndUpdate(
          { userId: to },
          to_user
        );
        return to_user;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function removeFriendRequest(from, to) {
  try {
    let collection = await getUserCollection();
    try {
      let from_user = await collection.findOne({ userId: from });
      let to_user = await collection.findOne({ userId: to });

      from_user.friends = from_user.friends.filter((x) => {
        return x.userId !== to;
      });

      to_user.friends = to_user.friends.filter((x) => {
        return x.userId !== from;
      });

      try {
        let user_from_send = await collection.findOneAndUpdate(
          { userId: from },
          from_user
        );

        let user_to_send = await collection.findOneAndUpdate(
          { userId: to },
          to_user
        );
        return to_user;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function sendRequest(from, to) {
  try {
    let collection = await getUserCollection();
    try {
      let from_user = await collection.findOne({ userId: from });
      let to_user = await collection.findOne({ userId: to });

      let from_user_ = {
        userId: from_user.userId,
        userName: from_user.userName,
        profilePic: from_user.profilePic,
        pending: from,
      };

      let to_user_ = {
        userId: to_user.userId,
        userName: to_user.userName,
        profilePic: to_user.profilePic,
        pending: from,
      };
      from_user.friends.push(to_user_);

      to_user.friends.push(from_user_);
      try {
        let user_from_send = await collection.findOneAndUpdate(
          { userId: from },
          from_user
        );

        let user_to_send = await collection.findOneAndUpdate(
          { userId: to },
          to_user
        );
        return [from_user, to_user];
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteAllUsers() {
  try {
    let colleciton = await getUserCollection();
    colleciton.deleteMany({});
  } catch (error) { }
}
export {
  deleteAllUsers,
  addFriend,
  createUser,
  removeFriend,
  blockFriend,
  setPending,
  getUserData,
  findUserName,
  searchUsers,
  rejectRequest,
  acceptRequest,
  sendRequest,
  unBlockRequest,
  blockRequest,
  removeFriendRequest,
};
