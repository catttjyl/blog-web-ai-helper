// app/page.js 主页
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Link href={'/posts'}>跳转blog列表页</Link>
    </div>
  );
}
