import Link from 'next/link';
import { appLinks } from '@/data/links';
import ExplicacaoClient from './ExplicacaoClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return appLinks.map((link) => ({
    id: link.id,
  }));
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const linkItem = appLinks.find((item) => item.id === resolvedParams.id);

  if (!linkItem) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <p className="text-zinc-400 mb-4">Item ou Jogo não encontrado.</p>
        <Link href="/" className="px-4 py-2 bg-zinc-800 rounded-full text-xs">Voltar ao Painel</Link>
      </div>
    );
  }

  return <ExplicacaoClient linkItem={linkItem} />;
}
