import TextArea from "../../components/TextArea"; 

export default async function createNewPostPage({ params }) {
  return (
    <main>
      <TextArea mode='add'/>
    </main>
  );
}