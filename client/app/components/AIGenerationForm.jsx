"use client";

export default function AIGenerationForm({ onGenerate }) {
  const handleGeneration = async (formData) => {
    const summary = formData.get("summary");
    const tone = formData.get("tone");
    const extra = formData.get("extra");
    const hasTitle = formData.get("hasTitle");
    console.log("Generating with:", { summary, tone, extra, hasTitle });
    await onGenerate({ summary, tone, extra, hasTitle });
  };

  return (
    <form action={handleGeneration} className="grid gap-2">
      <div className="flex mb-2 justify-between">
        <div className="flex items-end flex-1 whitespace-nowrap">
          内容概括：
          <input
            required
            name="summary"
            className="border-b border-gray-400 p-1 w-10/12"
          />
        </div>
        <div className="flex items-end">
          选择文本风格：
          <select name="tone" className="border-b border-gray-400 p-1">
            <option value="default">默认</option>
            <option value="narrative">叙事</option>
            <option value="fun">风趣</option>
            <option value="antique">古风</option>
          </select>
        </div>
      </div>
      <textarea
        name="extra"
        placeholder="补充信息"
        className="border border-gray-400 p-2"
      />
      <button
        type="submit"
        className="ml-auto bg-gray-400 text-white px-2 py-1"
      >
        开始生成
      </button>
    </form>
  );
}
