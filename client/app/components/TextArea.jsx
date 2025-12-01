"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";

import AIGenerationForm from "./AIGenerationForm";

import { Typography, Dropdown, Space, Popover, Divider } from "antd";
const { Title } = Typography;
import { FieldTimeOutlined, EllipsisOutlined } from "@ant-design/icons";

export default function TextArea({
  postId = null,
  initialTitle = "",
  initialContent = "",
  createDate = null,
  lastEditDate = null,
  mode = "edit", // 'edit' or 'add'
}) {
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedText, setSelectedText] = useState("");

  const [popup, setPopup] = useState(false);

  const index = useMemo(
    () => content.indexOf(selectedText),
    [content, selectedText]
  );

  const isEdit = useMemo(
    () => (mode === "add" || editMode) && !previewMode,
    [mode, editMode, previewMode]
  );

  const createNewPost = async () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("标题和内容不能为空！");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/posts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (data.success) {
        setEditMode(false);
        alert("创建成功！");
        router.push(`/posts/${data.id}`);
      } else {
        alert("保存失败：" + (data.message || "未知错误"));
      }
    } catch (error) {
      console.error("Failed to create new post:", error);
    }
  };

  const updatePostContent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId,
          title,
          content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditMode(false);
        alert("保存成功！");
        router.refresh();
      } else {
        alert("保存失败：" + (data.message || "未知错误"));
      }
    } catch (error) {
      console.error("Failed to update post content:", error);
    } finally {
      setLoading(false);
    }
  };

  const exitEdit = () => {
    if (mode === "add") {
      router.back();
    } else {
      setTitle(initialTitle);
      setContent(initialContent);
      setEditMode(false);
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection().toString();
    setSelectedText(selection);
    if (!selection || selection.trim() === "") {
      setPopup(false);
      return;
    }

    setPopup(true);
  };

  const readingMin = useMemo(
    () => Math.ceil(readingTime(content).minutes),
    [content]
  );

  const onGenerate = async ({ summary, tone, extra }) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/ai/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary, tone, extra }),
      });
      const data = await res.json();
      const cleaned = data
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      setTitle(parsed.title);
      setContent(parsed.outline.map((point) => `- ${point}`).join("\n"));
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      console.log("finally setLoading false");
      setLoading(false);
    }
  };

  const rephraseSelectedText = async () => {
    if (selectedText.trim() === "") {
      alert("请先选中文本！");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/ai/rephrase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullContext: content,
          selectedText,
        }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: !done });
        // rephrasedText += chunkValue;
        console.log("chunkValue=", chunkValue);
        setGeneratedContent((prev) => prev + chunkValue);
      }
      setPopup(false);
    } catch (error) {
      console.error("Failed to rephrase text:", error);
    }
  };

  return (
    <div className="relative flex flex-col gap-4 bg-white p-4 mt-8 rounded">
      {(mode === "add" || content === "") && (
        <>
          <AIGenerationForm onGenerate={onGenerate} />
          <Divider size="small" />
        </>
      )}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 flex items-center justify-center rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-white" />
        </div>
      )}
      {mode === "add" || editMode ? (
        <div className="flex justify-between">
          {previewMode ? (
            <button
              className="whitespace-nowrap border px-2"
              onClick={() => setPreviewMode(false)}
            >
              返回编辑
            </button>
          ) : (
            <button
              className="whitespace-nowrap border px-2"
              onClick={() => setPreviewMode(true)}
            >
              预览
            </button>
          )}
          <div>
            <button
              className="whitespace-nowrap outline-black px-2"
              onClick={exitEdit}
            >
              放弃编辑
            </button>
            <button
              className="whitespace-nowrap bg-gray-800 text-white px-2"
              onClick={mode === "add" ? createNewPost : updatePostContent}
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <Dropdown
          menu={{
            items: [{ label: "编辑" }],
            onClick: () => setEditMode(true),
          }}
        >
          <EllipsisOutlined className="absolute right-5 cursor-pointer" />
        </Dropdown>
      )}
      {isEdit ? (
        <>
          <textarea
            style={{
              width: "100%",
              border: "1px solid #ccc",
              padding: "10px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
            placeholder="请输入标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Popover
            content={
              <button onClick={rephraseSelectedText}>改写选中文本</button>
            }
            open={popup}
          >
            <textarea
              style={{
                width: "100%",
                height: "200px",
                border: "1px solid #ccc",
                padding: "10px",
                fontSize: "16px",
              }}
              placeholder="请输入文章内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleMouseUp}
            />
          </Popover>
        </>
      ) : (
        <>
          <Title level={2}>{title}</Title>
          <Space className="text-gray-600" separator="•">
            {createDate}
            <div>
              <FieldTimeOutlined className="mr-1" />
              阅读{readingMin}分钟
            </div>
          </Space>
          <div className="markdown-body">
            <ReactMarkDown remarkPlugins={[remarkGfm]}>{content}</ReactMarkDown>
          </div>
        </>
      )}
      {generatedContent && (
        <div style={{ marginTop: "20px" }}>
          <h2>AI生成内容预览：</h2>
          <div
            style={{
              width: "100%",
              minHeight: "200px",
              border: "1px solid #ccc",
              padding: "10px",
              fontSize: "16px",
            }}
          >
            ....{content.slice(index - 10, index)}
            <span style={{ background: "#FFEA00" }}>{generatedContent}</span>
            {content.slice(
              index + selectedText.length,
              index + selectedText.length + 10
            )}
            .....
          </div>
          <button
            className="whitespace-nowrap bg-gray-800 text-white px-2"
            onClick={() => {
              setContent(content.replace(selectedText, generatedContent));
              setSelectedText("");
              setGeneratedContent("");
            }}
          >
            替换文本
          </button>
        </div>
      )}
      {lastEditDate && `最后编辑于${lastEditDate}`}
    </div>
  );
}
