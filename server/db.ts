import { ChatMessage } from '@/types/chat';
import { MongoClient } from 'mongodb';

// Replace with your actual MongoDB connection string
const uri = 'mongodb://localhost:27017'; // Update this with your MongoDB URI
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

async function saveChatMessage(userId: string, message: string, sender: string) {
    const database = client.db('chats_database'); // Replace with your database name
    const collection = database.collection('chats'); // Replace with your collection name

    const chatMessage = {
        userId,
        message,
        sender,
        timestamp: new Date()
    };

    await collection.insertOne(chatMessage);
}


async function getAllChatMessages(userId: string):Promise<ChatMessage[]> {
  const database = client.db('chats_database'); // Replace with your database name
  const collection = database.collection('chats'); // Replace with your collection name

  const messages = await collection.find({ userId }).toArray();
  return messages.map((message) => ({
    role: message.sender === "ai" ? "model" : "user",
    content: message.message,
    timestamp: message.timestamp,
    id: message._id.toHexString()
  }));
}

async function closeConnection() {
    await client.close();
}

export { connectDB, saveChatMessage, closeConnection, getAllChatMessages };