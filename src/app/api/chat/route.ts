import { GoogleGenerativeAI } from '@google/generative-ai'
import { connectDB, getAllChatMessages, saveChatMessage } from '../../../../server/db'
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    console.log('API received messages:', messages)

    await connectDB()
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp', systemInstruction: "Your primary goal is to assist the user in brainstorming, organizing, and planning their ideas effectively. Provide creative suggestions, structured frameworks, and actionable steps to help the user develop, refine, and execute their ideas. Offer guidance, ask clarifying questions, and adapt to the user's needs to ensure their vision is clear and achievable" })


    await saveChatMessage('user1', messages[messages.length - 1].content, 'user')


    const googleMessages = messages.map((message: { role: string; content: string }) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }))
    

    console.log('API sending messages:', JSON.stringify(googleMessages, null, 2))

    const chat = model.startChat({
      history: googleMessages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.9,
      },
    })

    const result = await chat.sendMessage(googleMessages[googleMessages.length - 1].parts[0].text)
    const response = await result.response
    const text = response.text()
    console.log('API sending response:', text)

    await saveChatMessage('user1', text, 'ai')

    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response('Error processing chat request', { status: 500 })
  }
}


// Existing POST function...

export async function GET() {
    try {
        await connectDB();
        
        const messages = await getAllChatMessages('user1');

        return NextResponse.json(messages); // Return messages as JSON
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.error();
    }
}