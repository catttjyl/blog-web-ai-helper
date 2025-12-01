// app/posts/page.js
// blogs 列表页

import Link from 'next/link'
import PostList from '../components/PostList.jsx';

async function fetchPosts() {
  const res = await fetch("http://localhost:8080/posts", {
    cache: "no-store", // 不缓存，保证每次都取最新数据
  });

  return res.json();
}

export default async function PostsPage({mode}) {
  const posts = await fetchPosts();

  return (
    <main className="w-full lg:w-200 p-8 mx-auto">      
      <PostList posts={posts} />
    </main>
  );
}
