/**
 * LangChain.js 简单示例
 *
 * 这个文件展示了如何使用 LangChain.js 与 Qwen 3.5 Flash 模型进行交互
 *
 * 安装步骤：
 * 1. 确保安装了 Node.js (建议 v16+)
 * 2. 运行: npm install
 * 3. 在 .env 文件中设置 ALIBABA_API_KEY
 * 4. 运行: node simple-example.js
 */

import "dotenv/config";
import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

async function main() {
  console.log("LangChain.js 与 Qwen 3.5 Flash 模型交互示例");
  console.log("==============================================");

  try {
    // 初始化模型
    const model = new ChatAlibabaTongyi({
      model: "qwen-turbo", // 请确认准确的模型名称
      temperature: 0.7,
      apiKey: process.env.ALIBABA_API_KEY, // 有时字段名是 apiKey 而不是 alibabaApiKey
    });

    console.log("模型初始化成功！");

    // 示例 1: 基本聊天
    console.log("\n示例 1: 基本聊天");
    console.log("- - - - - - - - - - - - - - - - - - - - - -");
    const messages1 = [
      new SystemMessage("你是一个友好的助手，总是用中文回答问题。"),
      new HumanMessage("你好，请问你是谁？"),
    ];
    const result1 = await model.invoke(messages1);
    console.log("AI 回复:", result1.content);

    // 示例 2: 问答
    console.log("\n示例 2: 问答");
    console.log("- - - - - - - - - - - - - - - - - - - - - -");
    const messages2 = [
      new SystemMessage("你是一个知识渊博的助手，善于回答各种问题。"),
      new HumanMessage("什么是人工智能？"),
    ];
    const result2 = await model.invoke(messages2);
    console.log("AI 回复:", result2.content);

    // 示例 3: 创意写作
    console.log("\n示例 3: 创意写作");
    console.log("- - - - - - - - - - - - - - - - - - - - - -");
    const messages3 = [
      new SystemMessage("你是一个创意作家，擅长编写短篇故事。"),
      new HumanMessage("请写一个关于未来世界的短篇故事，长度约 200 字。"),
    ];
    const result3 = await model.invoke(messages3);
    console.log("AI 回复:", result3.content);

    console.log("\n所有示例运行完成！");
  } catch (error) {
    console.error("运行示例时出错:", error);
    console.log("\n请检查以下几点：");
    // console.log(1. 确保在 .env 文件中设置了正确的 ALIBABA_API_KEY);
    // console.log(2. 确保你的网络连接正常);
    // console.log(3. 确保你的 API Key 有访问 Qwen 3.5 Flash 模型的权限);
    // console.log(4. 如果你使用的是代理，请确保代理配置正确);
  }
}

// 运行示例
main();
