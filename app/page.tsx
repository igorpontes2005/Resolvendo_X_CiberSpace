'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { appLinks, AppLink, StatusType } from '@/data/links';
import { MoreVertical, Globe, Info, Settings, RefreshCw, Mail, X, Copy, Check, Gamepad2 } from 'lucide-react';

export default function LinksDashboard() {
  const [links, setLinks] = useState<AppLink[]>(appLinks);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const DEV_EMAIL = "igorhonorio@edu.unifor.br";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEV_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkSingleStatus = async (link: AppLink): Promise<AppLink> => {
    // Se for um jogo ou arquivo interno, não precisa de checagem HTTP
    if (link.isInternal) {
      return {
        ...link,
        status: 'online',
        lastChecked: new Date().toLocaleTimeString(),
      };
    }

    try {
      const res = await fetch(`/api/check-status?url=${encodeURIComponent(link.url)}`);
      const data = await res.json();
      return {
        ...link,
        status: data.status as StatusType,
        lastChecked: new Date().toLocaleTimeString(),
      };
    } catch {
      return { ...link, status: 'offline' };
    }
  };

  const checkAllStatuses = async () => {
    setIsRefreshing(true);
    const updatedLinks = await Promise.all(
      links.map((link) => checkSingleStatus(link))
    );
    setLinks(updatedLinks);
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkAllStatuses();
    const interval = setInterval(() => {
      checkAllStatuses();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'offline':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'instavel':
      case 'manutencao':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'instavel': return 'Instável';
      case 'manutencao': return 'Manutenção';
      case 'checando': return 'Verificando...';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex justify-center py-10 px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-sm font-semibold tracking-widest text-zinc-100">MEUS LINKS E STATUS</h1>
          
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={checkAllStatuses} 
              title="Atualizar Status Agora"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-green-400' : ''}`} />
            </button>
            
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="text-zinc-400 hover:text-white transition-colors focus:outline-none"
            >
              <Settings className="w-6 h-6" />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 top-9 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-30 overflow-hidden">
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsContactModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors w-full text-left"
                >
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span>E-mail do desenvolvedor</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Links */}
        <div className="space-y-4">
          {links.map((link) => {
            const href = link.isInternal ? link.url : `https://${link.url}`;

            return (
              <div key={link.id} className="relative flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                
                <div className="flex items-center gap-4">
                  {link.isInternal ? (
                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Globe className="w-5 h-5 text-zinc-500" />
                  )}
                  <div>
                    <h2 className="text-sm font-medium text-zinc-200">{link.title}</h2>
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {link.isInternal ? 'Abrir Jogo' : link.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded-full border text-[10px] font-medium flex items-center gap-1.5 ${getStatusStyles(link.status)}`}>
                    {getStatusLabel(link.status)}
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      link.status === 'online' ? 'bg-green-500 animate-pulse' : 
                      link.status === 'offline' ? 'bg-red-500' : 
                      link.status === 'checando' ? 'bg-zinc-400 animate-ping' : 'bg-yellow-500'
                    }`}></span>
                  </div>
                  
                  <button 
                    onClick={() => toggleMenu(link.id)}
                    className="p-1 text-zinc-400 hover:text-white transition-colors focus:outline-none"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Menu dos 3 Pontos atualizado para redirecionar dinamicamente pelo ID */}
                {openMenuId === link.id && (
                  <div className="absolute right-0 top-14 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                    <Link 
                      href={`/explicacao/${link.id}`}
                      className="flex items-center gap-2 px-4 py-3 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors w-full text-left"
                    >
                      <Info className="w-4 h-4 text-zinc-400" />
                      <span>Como funciona?</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal de E-mail do Dev */}
        {isContactModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-400" />
                  Contato do Desenvolvedor
                </h3>
                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                Dúvidas, sugestões ou relatórios de bugs podem ser enviados para:
              </p>

              <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <span className="text-xs font-mono text-zinc-200 select-all">{DEV_EMAIL}</span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-1 text-[10px]"
                  title="Copiar e-mail"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}