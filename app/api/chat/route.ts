import { NextRequest, NextResponse } from 'next/server'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
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

    // 调用模型
    const response = await model.invoke(messages)

    return NextResponse.json({ response: response.content })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
