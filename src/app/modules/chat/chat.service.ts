import httpStatus from 'http-status';
import { Chat } from './chat.model';
import { Message } from '../message/message.model';
import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import { User } from '../user/user.model';

const createChatIntoDB = async (participants: string[]) => {
     const isExistChat = await Chat.findOne({
          participants: { $all: participants },
     });

     if (isExistChat) {
          return isExistChat;
     }
     const newChat = await Chat.create({
          participants: participants,
          lastMessage: null,
     });
     if (!newChat) {
          throw new Error('Failed to create chat');
     }

     //@ts-ignore
     const io = global.io;
     newChat.participants.forEach((participant) => {
          //@ts-ignore
          io.emit(`newChat::${participant._id}`, newChat);
     });
     return newChat;
};

const markChatAsRead = async (userId: string, chatId: string) => {
     return Chat.findByIdAndUpdate(chatId, { $addToSet: { readBy: userId } }, { new: true });
};

// 5. Updated getAllChatsFromDB with better unread count calculation
const getAllChatsFromDB = async (userId: string, query: Record<string, any>) => {
     const searchTerm = query.searchTerm?.toLowerCase();
     const page = parseInt(query.page) || 1;
     const limit = parseInt(query.limit) || 10;
     const skip = (page - 1) * limit;

     const chatQuery = {
          participants: { $in: [userId] },
          deletedBy: { $ne: userId },
     };

     let chats;
     let totalChats;

     if (searchTerm) {
          const allChats = await Chat.find(chatQuery).populate('lastMessage').lean().sort({ updatedAt: -1 });

          const allChatLists = await Promise.all(
               allChats.map(async (chat) => {
                    const otherParticipantIds = chat.participants.filter((participantId) => participantId.toString() !== userId);

                    const otherParticipants = await User.find({
                         _id: { $in: otherParticipantIds },
                    })
                         .select('_id image fullName email')
                         .lean();

                    // FIXED: Correct unread count calculation
                    // Count messages where:
                    // 1. Message is in this chat
                    // 2. Message sender is NOT the current user
                    // 3. Message is not read
                    // 4. Message is not deleted
                    const unreadCount = await Message.countDocuments({
                         chatId: chat._id,
                         sender: { $ne: userId },
                         read: false,
                         isDeleted: false,
                    });

                    const isMuted = chat.mutedBy?.some((id: any) => id.toString() === userId) || false;
                    const isBlocked = chat.blockedUsers?.some((block: any) => block.blocker.toString() === userId || block.blocked.toString() === userId) || false;

                    return {
                         ...chat,
                         participants: otherParticipants,
                         isRead: unreadCount === 0, // Chat is read if no unread messages
                         unreadCount,
                         isMuted,
                         isBlocked,
                    };
               }),
          );

          const filteredChats = allChatLists.filter((chat) => {
               return chat.participants.some((participant) => participant.name.toLowerCase().includes(searchTerm));
          });

          totalChats = filteredChats.length;
          chats = filteredChats.slice(skip, skip + limit);
     } else {
          totalChats = await Chat.countDocuments(chatQuery);

          const rawChats = await Chat.find(chatQuery).populate('lastMessage').lean().sort({ updatedAt: -1 }).skip(skip).limit(limit);

          chats = await Promise.all(
               rawChats.map(async (chat) => {
                    const otherParticipantIds = chat.participants.filter((participantId) => participantId.toString() !== userId);

                    const otherParticipants = await User.find({
                         _id: { $in: otherParticipantIds },
                    })
                         .select('_id image fullName email')
                         .lean();

                    // FIXED: Same unread count calculation
                    const unreadCount = await Message.countDocuments({
                         chatId: chat._id,
                         sender: { $ne: userId },
                         read: false,
                         isDeleted: false,
                    });

                    const isMuted = chat.mutedBy?.some((id: any) => id.toString() === userId) || false;
                    const isBlocked = chat.blockedUsers?.some((block: any) => block.blocker.toString() === userId || block.blocked.toString() === userId) || false;

                    return {
                         ...chat,
                         participants: otherParticipants,
                         isRead: unreadCount === 0,
                         unreadCount,
                         isMuted,
                         isBlocked,
                    };
               }),
          );
     }

     const unreadChatsCount = chats.filter((chat) => chat.unreadCount > 0).length;
     const totalUnreadMessages = chats.reduce((total, chat) => total + chat.unreadCount, 0);

     const totalPage = Math.ceil(totalChats / limit);

     return {
          data: chats,
          unreadChatsCount,
          totalUnreadMessages,
          meta: {
               limit,
               page,
               total: totalChats,
               totalPage,
          },
     };
};

const softDeleteChatForUser = async (chatId: string, id: string) => {
     const userId = new mongoose.Types.ObjectId(id);
     const chat = await Chat.findById(chatId);
     if (!chat) {
          throw new AppError(httpStatus.NOT_FOUND, 'Chat not found');
     }

     if (!chat.participants.some((id) => id.toString() === userId.toString())) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized');
     }

     // If already deleted by this user, just return
     if (chat.deletedBy.some((id) => id.toString() === userId.toString())) {
          return chat;
     }

     // Add userId to deletedBy array
     chat.deletedBy.push(userId);

     // Optional: If all participants deleted, mark status deleted (soft delete for everyone)
     if (chat.deletedBy.length === chat.participants.length) {
          chat.isDeleted = true;
     }

     await chat.save();

     //@ts-ignore
     const io = global.io;
     chat.participants.forEach((participant) => {
          //@ts-ignore
          io.emit(`chatDeletedForUser::${participant._id}`, { chatId, userId });
     });

     return chat;
};

// New feature: Mute/Unmute chat
const muteUnmuteChat = async (userId: string, chatId: string, action: 'mute' | 'unmute') => {
     const chat = await Chat.findById(chatId);
     if (!chat) {
          throw new AppError(httpStatus.NOT_FOUND, 'Chat not found');
     }

     if (!chat.participants.some((id) => id.toString() === userId)) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized');
     }

     if (action === 'mute') {
          // Add user to mutedBy array if not already muted
          await Chat.findByIdAndUpdate(chatId, { $addToSet: { mutedBy: userId } }, { new: true });
     } else {
          // Remove user from mutedBy array
          await Chat.findByIdAndUpdate(chatId, { $pull: { mutedBy: userId } }, { new: true });
     }

     const updatedChat = await Chat.findById(chatId);

     //@ts-ignore
     const io = global.io;
     //@ts-ignore
     io.emit(`chatMuteStatus::${userId}`, {
          chatId,
          isMuted: action === 'mute',
          action,
     });

     return updatedChat;
};

// New feature: Block/Unblock user in chat
const blockUnblockUser = async (blockerId: string, blockedId: string, chatId: string, action: 'block' | 'unblock') => {
     const chat = await Chat.findById(chatId);
     if (!chat) {
          throw new AppError(httpStatus.NOT_FOUND, 'Chat not found');
     }

     // Check if both users are participants
     const participants = chat.participants.map((p) => p.toString());
     if (!participants.includes(blockerId) || !participants.includes(blockedId)) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'One or both users are not participants in this chat');
     }

     if (action === 'block') {
          // Check if already blocked
          const existingBlock = chat.blockedUsers?.find((block: any) => block.blocker.toString() === blockerId && block.blocked.toString() === blockedId);

          if (existingBlock) {
               throw new AppError(httpStatus.BAD_REQUEST, 'User is already blocked');
          }

          // Add to blocked users
          await Chat.findByIdAndUpdate(
               chatId,
               {
                    $push: {
                         blockedUsers: {
                              blocker: blockerId,
                              blocked: blockedId,
                              blockedAt: new Date(),
                         },
                    },
               },
               { new: true },
          );
     } else {
          // Remove from blocked users
          await Chat.findByIdAndUpdate(
               chatId,
               {
                    $pull: {
                         blockedUsers: {
                              blocker: blockerId,
                              blocked: blockedId,
                         },
                    },
               },
               { new: true },
          );
     }

     const updatedChat = await Chat.findById(chatId);

     //@ts-ignore
     const io = global.io;
     // Notify both users
     [blockerId, blockedId].forEach((userId) => {
          //@ts-ignore
          io.emit(`userBlockStatus::${userId}`, {
               chatId,
               blockerId,
               blockedId,
               isBlocked: action === 'block',
               action,
          });
     });

     return updatedChat;
};

export const ChatService = {
     createChatIntoDB,
     getAllChatsFromDB,
     markChatAsRead,
     softDeleteChatForUser,
     muteUnmuteChat,
     blockUnblockUser,
};
