import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

import OpenAI from "openai";
const openAIClient = new OpenAI();

import { GoogleGenAI } from "@google/genai";
const geminiClient = new GoogleGenAI({});

import { OpenRouter } from "@openrouter/sdk";
const openrouterClient = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

import { Groq } from 'groq-sdk';
const groq = new Groq();

const deepseekClient = new OpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: process.env.DEEPSEEK_API_KEY,
});

const moonshotClient = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,    
    baseURL: "https://openrouter.ai/api/v1",
});

const toneMap = {
    "default": "默认",
    "幽默": "humorous",
    "antique": "古风",
    "fun": "风趣",
    "narrative": "叙事",
};

// 生成标题和大纲
export async function generateOutline(req, res) {
  console.log(req.body);
  const { summary, tone, extra, hasTitle = 'Y' } = req.body;
  const response = await geminiClient.models.generateContent({
    model: "gemini-2.5-flash",
    // contents: //测试内容
    //   `返回内容严格按照以下JSON格式输出：
    //     {
    //       "title": "测试ai生成的标题",
    //       "outline": [
    //         "字段1",
    //         "字段2",
    //         "字段3"
    //       ]
    //     }
    //   `
    contents: 
      `请根据以下信息生成博客标题和大纲:
      用户提供的博客内容概述：${summary}。
      博客内容风格需求：${toneMap[tone]}。
      其他补充信息：${extra}。
      
      返回内容严格按照以下JSON格式输出：
        {
          "title": "xxx",
          "outline": [
            "xxx",
            "xxx",
            "xxx"
          ]
        }
      `,
    config: {
      systemInstruction:
        `你是一个中文博客写作助手，根据用户提供的信息生成博客标题和大纲。
          生成规则：
          1、标题吸引人且不超过 20 字
          2、大纲内容有 3-6 点为佳，每点不超过 50 字，要求逻辑清晰、表达自然、风格统一。
          3、不要回答任何关于博客写作以外的问题。
          4、不要回答、不得生成任何关于恐怖主义、种族歧视、性别歧视、暴力的内容。`
    },
  });

  res.json(response.text);
}

// 续写文章
export async function contentContinudation(req, res) {
  const { summary, tone, extra } = req.body;
    const completion = await moonshotClient.chat.completions.create({
        model: "kimi-k2-turbo-preview",
        messages: [ 
            {role: "system", content: "你是一个中文博客写作助手，根据用户提供的概述、风格需求生成博客标题和大纲，大纲内容有 3-6 点为佳，要求逻辑清晰、表达自然、风格统一。不要回答任何关于博客写作以外的问题。不要回答、不得生成任何关于恐怖主义、种族歧视、性别歧视、暴力的内容。"},
            {role: "user", content: 
              `用户提供的博客内容概述：${summary}。
              博客内容风格需求：${tone}。
              其他补充信息：${extra}。
              
              请根据以上信息生成博客标题和大纲。`
            }
        ],
        temperature: 0.8
    });
    console.log(completion.choices[0].message.content);
}

// 改写文章
export async function rephraseContent(req, res) {
  console.log(req.body);
  const { fullContext, selectedText } = req.body;
  const stream = await groq.chat.completions.create({
      "model": "moonshotai/kimi-k2-instruct-0905",
      "messages": [ 
          {role: "system", content: 
            `你是一个中文博客写作助手，根据用户提供的全文，帮助用户改写选中的文本，使其表达更清晰流畅，风格更符合整体内容。
            生成规则：
            1、保留原意。
            2、风格与全文一致，避免突兀。
            3、不添加新观点、不改变事实。
            4、不得生成任何关于恐怖主义、种族歧视、性别歧视、暴力的内容。
            `
          },
          {role: "user", content: 
            `这是文章的全文内容：${fullContext}。
            这是用户选中的文本内容：${selectedText}。

            请根据以上信息改写选中的文本，仅返回改写后的文本，不要返回解释或额外内容。`
          }
      ],
      "max_completion_tokens": 4096,
      stream: true,
  });
  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) res.write(delta);
    // process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
  res.end();
}

// async function main() {
//   const completion = await deepseekClient.chat.completions.create({
//     model: "deepseek-chat",
//     messages: [
//       { role: "system", content: "你是一个中文助手。" },
//       { role: "user", content: "你好，请用一句话回应我：测试成功。" }
//     ],
//     temperature: 0.5,
//     max_tokens: 50
//   });
//   console.log(completion.choices[0].message.content);
// }

async function main() {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "user",
        "content": "你好，请用一句话回应我：测试成功。"
      }
    ],
    "model": "moonshotai/kimi-k2-instruct-0905",
    "temperature": 0.6,
    "max_completion_tokens": 4096,
    "top_p": 1,
    "stream": true,
    "stop": null
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

// async function main() {
//   const response = await geminiClient.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();