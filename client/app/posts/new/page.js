import TextArea from "../../components/TextArea"; 

export default async function createNewPostPage({ params }) {
  return (
    <main style={{ padding: "20px" }}>
      <h1>创建新文章</h1>
      <TextArea mode='add'/>
    </main>
  );
}