"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Dropdown,
  Space,
  Typography,
  Divider,
  FloatButton,
  Pagination,
} from "antd";
const { Title, Text } = Typography;

import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PostList({ posts }) {
  const router = useRouter();
  const [orderBy, setOrderBy] = useState("create_date");
  const items = [
    {
      key: "create_date",
      label: "创建日期",
    },
    {
      key: "last_edit_date",
      label: "更新日期",
    },
  ];
  const onClick = ({ key }) => {
    setOrderBy(key);
  };

  const { orderByCN, sortedPosts } = useMemo(() => {
    const item = items.find((i) => i.key === orderBy);
    const orderByCN = item ? item.label : "";
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(b[orderBy]) - new Date(a[orderBy])
    );
    return { orderByCN, sortedPosts };
  }, [orderBy]);

  return (
    <>
      <div className="flex justify-between align-text-bottom items-center m-0">
        <Title level={4}>最新文章</Title>
        <button
          onClick={() => router.push("posts/new")}
          className="flex group bg-gray-800 text-white px-2 py-1"
        >
          {/* <Link href={"posts/new"}> */}
          <div className="translate-x-2 group-hover:translate-x-0 transition mr-1">
            新增
          </div>
          <PlusOutlined className="opacity-0 rotate-180 group-hover:opacity-100 group-hover:rotate-0 transition" />
          {/* </Link> */}
        </button>
      </div>
      <Divider
        size="small"
        titlePlacement="start"
        plain
        styles={{ root: { margin: 0 } }}
      >
        <Dropdown menu={{ items, onClick, selectable: true }}>
          <Space className="cursor-pointer text-gray-500">
            {orderByCN}
            <DownOutlined className="text-xs" />
          </Space>
        </Dropdown>
      </Divider>
      <div className="w-11/12 mx-auto mt-4">
        {sortedPosts.length ? (
          <>
            {sortedPosts.map((post) => {
              const date = new Date(post[orderBy]);
              const month = new Intl.DateTimeFormat("zh-CN", {
                month: "long",
              }).format(date);
              return (
                <div
                  key={post.id}
                  className="mb-2 p-4 rounded-lg hover:shadow-lg hover:bg-white transition"
                >
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex space-x-5 > *"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-5xl font-bold">{date.getDate()}</div>
                      <div className="text-sm font-light whitespace-nowrap">
                        {month} {date.getFullYear()}
                      </div>
                    </div>
                    <div>
                      <Title level={5}>{post.title}</Title>
                      <div className="text-gray-500 line-clamp-2">
                        <ReactMarkDown remarkPlugins={[remarkGfm]}>
                          {post.content}
                        </ReactMarkDown>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
            <Pagination align="end" defaultCurrent={1} total={posts.length} />
          </>
        ) : (
          "暂无文章"
        )}
      </div>
      <FloatButton.BackTop />
    </>
  );
}
