import "dotenv/config";
const apiKey = process.env.ALIBABA_API_KEY;

import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import { AlibabaTongyiEmbeddings } from "@langchain/community/embeddings/alibaba_tongyi";

// import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import { HumanMessage } from "@langchain/core/messages";

// const model = new AlibabaTongyiEmbeddings({
//   alibabaApiKey: process.env.ALIBABA_API_KEY,
// });
// const res = await model.embedQuery(
//   "What would be a good company name a company that makes colorful socks?",
// );
// console.log({ res });

const qwenPlus = new ChatAlibabaTongyi({
  model: "qwen3.5-flash", // Available models: qwen-turbo, qwen-plus, qwen-max
  temperature: 1,
  alibabaApiKey: apiKey,
});

const messages = [new HumanMessage("Hello")];

const res = await qwenPlus.invoke(messages);
console.log(res.content);

// https://docs.langchain.org.cn/oss/javascript/integrations/chat/alibaba_tongyi
