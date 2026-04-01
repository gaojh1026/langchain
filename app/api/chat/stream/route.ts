import { NextRequest } from 'next/server'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 初始化模型
    const model = new ChatAlibabaTongyi({
      model: 'qwen-turbo',
      temperature: 0.7,
      topP: 0.8,
      maxTokens: 2000,
      apiKey: process.env.ALIBABA_API_KEY,
    })

    // 构建消息
    const messages = [
      new SystemMessage('你是一个专业、友好的聊天助手，基于通义千问模型。'),
      new HumanMessage(message),
    ]

    // 创建可读流
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // 流式调用模型
          const stream = await model.stream(messages)
          for await (const chunk of stream) {
            const content = chunk.content || ''
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }
        } catch (error) {
          console.error('Error in streaming:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to stream response' })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in streaming API:', error)
    return new Response(JSON.stringify({ error: 'Failed to process message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
