"use client";
import { Tooltip, Typography, message } from "antd";
const { Title } = Typography;
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function AIGenerationForm({ onGenerate }) {
  const [messageApi, contextHolder] = message.useMessage();

  const handleGeneration = async (formData) => {
    const summary = formData.get("summary");
    if (summary.trim() === "") {
      messageApi.open({
        type: "warning",
        content: "内容概括不能为空",
      });
      return;
    }
    const tone = formData.get("tone");
    const extra = formData.get("extra");
    // console.log("Generating with:", { summary, tone, extra });
    await onGenerate({ summary, tone, extra });
  };

  return (
    <div className="h-screen bg-white p-8">
      <div className="flex justify-between">
        {contextHolder}
        <Title level={4}>AI辅助生成大纲</Title>
        <Tooltip
          placement="bottom"
          title="用户只需要输入文章主题和想要的表达风格，AI就会自动生成标题和结构清晰、逻辑完整的文章大纲。"
        >
          <QuestionCircleOutlined />
        </Tooltip>
      </div>
      <form action={handleGeneration} className="grid gap-2 mt-2">
        <div className="flex items-end">
          选择文本风格：
          <select name="tone" className="border-b border-gray-400 p-1">
            <option value="default">默认</option>
            <option value="narrative">叙事</option>
            <option value="fun">风趣</option>
            <option value="antique">古风</option>
          </select>
        </div>
        <div className="flex items-end flex-1 whitespace-nowrap">
          内容概括：
          <input
            name="summary"
            className="border-b border-gray-400 p-1 w-10/12"
          />
        </div>
        <textarea
          name="extra"
          placeholder="补充信息"
          className="border border-gray-400 p-2 h-100"
        />
        <button
          type="submit"
          className="ml-auto bg-gray-400 text-white px-2 py-1"
        >
          开始生成
        </button>
      </form>
    </div>
  );
}
