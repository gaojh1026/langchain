/**
 * LangChain.js 通义千问完整示例
 * 包含多种交互方式和高级功能
 */

import "dotenv/config";
import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  AIMessageChunk,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

async function main() {
  console.log("LangChain.js 与通义千问完整交互示例");
  console.log("==============================================");
  console.log("模型: qwen-turbo\n");

  try {
    // 初始化模型
    const model = new ChatAlibabaTongyi({
      model: "qwen-turbo",
      temperature: 0.7,
      topP: 0.8,
      maxTokens: 2000,
      apiKey: process.env.ALIBABA_API_KEY,
    });

    console.log("✅ 模型初始化成功！\n");

    // ========== 1. 基础调用方法 ==========
    console.log("📌 第一部分：基础调用方法");
    console.log("=".repeat(50));

    // 1.1 invoke - 同步调用
    console.log("\n1.1 invoke() - 单次调用");
    console.log("-".repeat(40));
    const simpleMessages = [
      new SystemMessage("你是一个幽默风趣的助手。"),
      new HumanMessage("给我讲个笑话"),
    ];
    const response = await model.invoke(simpleMessages);
    console.log("AI 回复:", response.content);
    console.log("元数据:", response.response_metadata);

    // 1.2 stream - 流式输出
    console.log("\n1.2 stream() - 流式输出");
    console.log("-".repeat(40));
    console.log("AI 回复: ");
    const streamMessages = [new HumanMessage("请用一句话介绍什么是机器学习")];
    const stream = await model.stream(streamMessages);
    let fullContent = "";
    for await (const chunk of stream) {
      // chunk 是 AIMessageChunk 类型
      const content = chunk.content;
      process.stdout.write(content);
      fullContent += content;
    }
    console.log("\n\n✅ 流式输出完成，总长度:", fullContent.length);

    // 1.3 batch - 批量调用
    console.log("\n1.3 batch() - 批量调用");
    console.log("-".repeat(40));
    const batchPrompts = [
      [new HumanMessage("用三个词形容夏天")],
      [new HumanMessage("用三个词形容冬天")],
      [new HumanMessage("用三个词形容春天")],
    ];
    const batchResponses = await model.batch(batchPrompts);
    batchResponses.forEach((resp, idx) => {
      console.log(`批处理 ${idx + 1}: ${resp.content}`);
    });

    // ========== 2. Prompt 模板和链式调用 ==========
    console.log("\n\n📌 第二部分：Prompt 模板和链式调用");
    console.log("=".repeat(50));

    // 2.1 使用 PromptTemplate
    console.log("\n2.1 使用 ChatPromptTemplate");
    console.log("-".repeat(40));
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", "你是一个{role}专家，你的回答要专业且详细。"],
      ["human", "请解释一下{concept}的概念，要求{requirement}"],
    ]);

    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    const result = await chain.invoke({
      role: "人工智能",
      concept: "大语言模型",
      requirement: "用通俗易懂的语言，200字以内",
    });
    console.log("AI 回复:", result);

    // 2.2 多轮对话上下文管理
    console.log("\n2.2 多轮对话上下文管理");
    console.log("-".repeat(40));
    const conversation = [
      new SystemMessage(
        "你是一个耐心的数学老师，擅长用简单的方法解释复杂问题。",
      ),
      new HumanMessage("什么是微积分？"),
    ];

    const response1 = await model.invoke(conversation);
    console.log("学生: 什么是微积分？");
    console.log("老师:", response1.content);

    // 添加对话历史
    conversation.push(new AIMessage(response1.content));
    conversation.push(new HumanMessage("能举个生活中的例子吗？"));

    const response2 = await model.invoke(conversation);
    console.log("\n学生: 能举个生活中的例子吗？");
    console.log("老师:", response2.content);

    // ========== 3. 高级功能 ==========
    console.log("\n\n📌 第三部分：高级功能");
    console.log("=".repeat(50));

    // 3.1 配置不同的生成参数
    console.log("\n3.1 不同温度参数对比");
    console.log("-".repeat(40));

    const creativeModel = new ChatAlibabaTongyi({
      model: "qwen-turbo",
      temperature: 0.9, // 高温度，更具创造性
      apiKey: process.env.ALIBABA_API_KEY,
    });

    const preciseModel = new ChatAlibabaTongyi({
      model: "qwen-turbo",
      temperature: 0.1, // 低温度，更精确
      apiKey: process.env.ALIBABA_API_KEY,
    });

    const testPrompt = [new HumanMessage("给宠物店起10个名字")];

    const creativeNames = await creativeModel.invoke(testPrompt);
    const preciseNames = await preciseModel.invoke(testPrompt);

    console.log("创造性模式 (temperature=0.9):");
    console.log(creativeNames.content);
    console.log("\n精确模式 (temperature=0.1):");
    console.log(preciseNames.content);

    // 3.2 带函数调用的配置
    console.log("\n3.2 自定义参数配置");
    console.log("-".repeat(40));

    const customModel = new ChatAlibabaTongyi({
      model: "qwen-turbo",
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 500,
      stop: ["。", "！"], // 停止词
      apiKey: process.env.ALIBABA_API_KEY,
    });

    const customResponse = await customModel.invoke([
      new HumanMessage("请说一段关于编程的话"),
    ]);
    console.log("自定义配置的回复:", customResponse.content);

    // ========== 4. 实用场景示例 ==========
    console.log("\n\n📌 第四部分：实用场景示例");
    console.log("=".repeat(50));

    // 4.1 文本摘要
    console.log("\n4.1 文本摘要功能");
    console.log("-".repeat(40));
    const longText = `
    人工智能（AI）是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。
    这些任务包括视觉感知、语音识别、决策制定和语言翻译等。近年来，深度学习技术的突破使得
    人工智能在图像识别、自然语言处理等领域取得了巨大进展。大语言模型的出现更是让AI能够
    理解和生成人类水平的文本，为各行各业带来革命性的变化。
    `;

    const summaryPrompt = [
      new SystemMessage(
        "你是一个专业的文本摘要助手，请将以下内容用100字以内概括。",
      ),
      new HumanMessage(longText),
    ];
    const summary = await model.invoke(summaryPrompt);
    console.log("原文:", longText.trim());
    console.log("\n摘要:", summary.content);

    // 4.2 代码生成
    console.log("\n4.2 代码生成");
    console.log("-".repeat(40));
    const codePrompt = [
      new SystemMessage("你是一个专业的编程助手，只输出代码，不要解释。"),
      new HumanMessage("用Python写一个快速排序算法"),
    ];
    const codeResponse = await model.invoke(codePrompt);
    console.log("生成的代码:");
    console.log(codeResponse.content);

    // 4.3 情感分析
    console.log("\n4.3 情感分析");
    console.log("-".repeat(40));
    const sentimentPrompt = ChatPromptTemplate.fromMessages([
      ["system", "分析以下文本的情感倾向，只输出：积极、消极或中性。"],
      ["human", "{text}"],
    ]);

    const sentimentChain = sentimentPrompt
      .pipe(model)
      .pipe(new StringOutputParser());

    const texts = [
      "今天天气真好，心情特别愉快！",
      "糟糕，我把钥匙忘在家里了。",
      "这个产品还行吧，能用。",
    ];

    for (const text of texts) {
      const sentiment = await sentimentChain.invoke({ text });
      console.log(`"${text}" → 情感: ${sentiment}`);
    }

    // 4.4 结构化输出
    console.log("\n4.4 结构化输出");
    console.log("-".repeat(40));
    const structuredPrompt = [
      new SystemMessage(`请以JSON格式输出，格式如下：
      {
        "name": "书名",
        "author": "作者",
        "year": 出版年份,
        "summary": "简短介绍"
      }`),
      new HumanMessage("介绍《三体》这本书"),
    ];

    const structuredResponse = await model.invoke(structuredPrompt);
    console.log("结构化输出:");
    console.log(structuredResponse.content);

    // ========== 5. 错误处理和重试机制 ==========
    console.log("\n\n📌 第五部分：错误处理和重试机制");
    console.log("=".repeat(50));

    // 5.1 带重试的调用
    async function withRetry(fn, maxRetries = 3) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (error) {
          console.log(`尝试 ${i + 1}/${maxRetries} 失败: ${error.message}`);
          if (i === maxRetries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    console.log("\n5.1 带重试机制的调用示例");
    console.log("-".repeat(40));
    const safeCall = await withRetry(async () => {
      return await model.invoke([new HumanMessage("测试重试机制")]);
    });
    console.log("成功获取响应:", safeCall.content.substring(0, 50) + "...");

    // 5.2 超时控制
    console.log("\n5.2 超时控制示例");
    console.log("-".repeat(40));
    const timeoutPromise = (promise, timeoutMs) => {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`请求超时 ${timeoutMs}ms`)),
            timeoutMs,
          ),
        ),
      ]);
    };

    try {
      const timeoutResult = await timeoutPromise(
        model.invoke([new HumanMessage("快速响应的问题")]),
        5000,
      );
      console.log("超时控制内完成:", timeoutResult.content.substring(0, 50));
    } catch (error) {
      console.log("超时错误:", error.message);
    }

    // ========== 6. 性能监控 ==========
    console.log("\n\n📌 第六部分：性能监控");
    console.log("=".repeat(50));

    // 6.1 记录调用耗时
    console.log("\n6.1 调用耗时统计");
    console.log("-".repeat(40));

    const measureTime = async (fn, name) => {
      const start = Date.now();
      const result = await fn();
      const end = Date.now();
      console.log(`${name}: ${end - start}ms`);
      return result;
    };

    await measureTime(
      () => model.invoke([new HumanMessage("快速问题")]),
      "单次调用耗时",
    );

    await measureTime(
      () =>
        model.batch([
          [new HumanMessage("问题1")],
          [new HumanMessage("问题2")],
          [new HumanMessage("问题3")],
        ]),
      "批量调用耗时",
    );

    console.log("\n✅ 所有示例运行完成！");
    console.log("\n💡 提示：");
    console.log("1. 根据实际需求调整 temperature 参数来控制创造性");
    console.log("2. 使用流式输出提升用户体验");
    console.log("3. 合理使用批量调用可以提高效率");
    console.log("4. 注意设置合适的 maxTokens 避免响应过长");
    console.log("5. 生产环境建议添加完善的错误处理和重试机制");
  } catch (error) {
    console.error("❌ 运行示例时出错:", error);
    console.log("\n🔧 请检查以下几点：");
    console.log("1. 确保在 .env 文件中设置了正确的 ALIBABA_API_KEY");
    console.log("2. 确保你的网络连接正常");
    console.log("3. 确保你的 API Key 有访问 Qwen 模型的权限");
    console.log("4. 如果使用代理，请确保代理配置正确");
    console.log(
      "5. 检查是否已安装必要的依赖：@langchain/community, @langchain/core",
    );

    // 显示详细错误信息
    if (error.response) {
      console.log("\nAPI 响应错误:", error.response.data);
    }
  }
}

// 运行示例
main().catch(console.error);

// 导出常用配置供其他模块使用
export const createQwenModel = (config = {}) => {
  return new ChatAlibabaTongyi({
    model: config.model || "qwen-turbo",
    temperature: config.temperature ?? 0.7,
    topP: config.topP ?? 0.8,
    maxTokens: config.maxTokens ?? 2000,
    apiKey: config.apiKey || process.env.ALIBABA_API_KEY,
    ...config,
  });
};
