'use client';

import { use } from 'react';
import Link from 'next/link';
import { appLinks } from '@/data/links';
import { ArrowLeft, Gamepad2, Globe, HelpCircle, CheckCircle2, Wrench } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}


export async function generateStaticParams() {
  return appLinks.map((link) => ({
    id: link.id,
  }));
}

export default function ExplicacaoJogoPage({ params }: PageProps) {
  
  const resolvedParams = use(params);
  const linkItem = appLinks.find((item) => item.id === resolvedParams.id);

  if (!linkItem) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <p className="text-zinc-400 mb-4">Item ou Jogo não encontrado.</p>
        <Link href="/" className="px-4 py-2 bg-zinc-800 rounded-full text-xs">Voltar ao Painel</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex justify-center py-10 px-4">
      <div className="w-full max-w-md max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between">
        
        {/* Conteúdo rolável */}
        <div className="overflow-y-auto pr-1 space-y-6">
          {/* Header com Botão de Voltar */}
          <div className="flex items-center justify-between mb-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Painel
            </Link>

            <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              {linkItem.isInternal ? 'Jogo HTML Local' : 'Website Externo'}
            </span>
          </div>

          {/* Título do Jogo / Aplicação */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
              {linkItem.isInternal ? (
                <Gamepad2 className="w-7 h-7 text-purple-400" />
              ) : (
                <Globe className="w-7 h-7 text-zinc-400" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100">{linkItem.title}</h1>
              <p className="text-xs text-zinc-500">{linkItem.url}</p>
            </div>
          </div>

          {/* Explicação Principal */}
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-green-400" />
                Como Funciona
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {linkItem.customExplanationText || linkItem.description}
              </p>
            </div>

            {/* Categoria 1: Como Jogar (Participante) */}
            {linkItem.howToPlaySteps && linkItem.howToPlaySteps.length > 0 && (
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
                <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  Como Jogar (Participante)
                </h2>
                <ul className="space-y-2.5">
                  {linkItem.howToPlaySteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categoria 2: Como Criar o Quiz (Instrutor) */}
            {linkItem.howToCreateSteps && linkItem.howToCreateSteps.length > 0 && (
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
                <h2 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-green-400" />
                  Como Criar o Quiz (Instrutor)
                </h2>
                <ul className="space-y-2.5">
                  {linkItem.howToCreateSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Botão de Ação Direta no Rodapé */}
        <div className="mt-6 pt-4 border-t border-zinc-900">
          <a
            href={linkItem.isInternal ? linkItem.url : `https://${linkItem.url}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-purple-600/20"
          >
            {linkItem.isInternal ? 'Jogar Agora (HTML)' : 'Acessar Plataforma'}
          </a>
        </div>

      </div>
    </div>
  );
}
