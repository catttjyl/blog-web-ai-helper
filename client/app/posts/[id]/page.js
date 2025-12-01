// app/posts/[id]/page.js
// blog post 详情页
import TextArea from '../../components/TextArea';
import CommentArea from "../../components/CommentArea";

async function fetchPostContent(id) {
  const res = await fetch(`http://localhost:8080/posts/${id}`, {
    cache: "no-store",
  });
  // console.log('res=', res);
  return res.json();
}

async function fetchComments(postId) {
    try {
      const res = await fetch(`http://localhost:8080/comments/${postId}`);
return res.json()    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }

export default async function PostDetailPage({ params }) {
  const {id} = await params;
  const post = await fetchPostContent(id);
  const comments = await fetchComments(id);
  const {title, content, create_date, last_edit_date} = post;
  const createDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(create_date));
  const lastEditDate  = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(last_edit_date));
  // const post = {id: id, title: "测试文章"+id, content: "这是测试文章"+id+"的内容。"};
  return (
    <main style={{ padding: "20px" }}>
      <TextArea postId={id} initialTitle={title} initialContent={content} createDate={createDate} lastEditDate={lastEditDate}/>
      <CommentArea postId={id} comments={comments} />
    </main>
  );
}
