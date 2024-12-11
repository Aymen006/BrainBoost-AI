import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const googleMessages = messages.map((message: { role: string; content: string }) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }))

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
