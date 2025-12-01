"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Divider, Dropdown, Typography } from "antd";
const { Title, Text } = Typography;
import { LikeFilled, LikeOutlined, EllipsisOutlined } from "@ant-design/icons";

export default function CommentArea({ postId, comments }) {
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [like, setLike] = useState(false);
  const items = [{ key: "delete", label: "删除" }];
  const addComment = async () => {
    if (newComment.trim() === "") {
      alert("评论内容不能为空！");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/comments/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment("");
        router.refresh();
      } else {
        alert("添加评论失败：" + (data.message || "未知错误"));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const deletComment = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/comments/${postId}/${commentId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("删除成功！");
        router.refresh();
      } else {
        alert("删除失败：" + (data.message || "未知错误"));
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="bg-white p-4 mt-8 rounded">
      <Title level={5}>评论区</Title>
      <Divider size="small" />
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="写下你的评论..."
        className="w-full border border-gray-400 p-4"
      />
      <button
        onClick={addComment}
        className="whitespace-nowrap bg-gray-800 text-white px-4 py-1 ml-auto block"
      >
        发送评论
      </button>
      <Text disabled>{comments.length}条评论</Text>
      <div className="mt-2">
        {comments.map((comment) => {
          const date = new Date(comment.comment_date);
          comment.comment_date = new Intl.DateTimeFormat("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(date);
          return (
            <div key={comment.id}>
              <>{comment.comment_content}</>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">
                  {comment.comment_date}
                </div>
                {/* <div onClick={() => setLike(!like)}>
                  {like ? <LikeFilled /> : <LikeOutlined />}
                </div> */}
                {/* <MessageOutlined /> */}
                <Dropdown
                  menu={{ items: [{ label: "编辑" }], onClick: deletComment }}
                >
                  <EllipsisOutlined />
                </Dropdown>
              </div>
              <Divider size="small" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
