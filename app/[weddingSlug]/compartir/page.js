"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CompartirFotosFiesta() {
  const params = useParams();
  const slug = params?.weddingSlug; // la carpeta es [weddingSlug], no [slug]

  const [boda, setBoda] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    async function obtenerBoda() {
      if (!slug) return;
      const { data } = await supabase
        .from('bodas')
        .select('*')
        .eq('slug', slug.toLowerCase().trim())
        .maybeSingle();
      
      if (data) setBoda(data);
      setCargando(false);
    }
    obtenerBoda();
  }, [slug]);

  const handleSubirFotoInvitado = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    setExito(false);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `invitado-${Date.now()}.${fileExt}`;
      // Lo guardamos ordenadamente en la carpeta del álbum de la fiesta
      const filePath = `${slug}/album-fiesta/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitaciones-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      setExito(true);
      alert("📸 ¡Tu fotografía se ha enviado al carrete en vivo de los novios! Gracias por compartir este recuerdo.");
    } catch (err) {
      console.error(err);
      alert("No se pudo colgar la foto, intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  if (cargando) return <div className="min-h-screen bg-[#110e17] flex items-center justify-center font-serif text-xs text-purple-300 animate-pulse uppercase tracking-widest">Abriendo Cámara Colectiva... ✨</div>;
  if (!boda) return <div className="min-h-screen bg-stone-900 flex items-center justify-center text-xs text-stone-400">⚠️ Evento no activo.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#181324] to-[#0d0a14] text-white flex flex-col justify-between p-6 font-sans antialiased">
      
      {/* CABECERA EMOCIONAL */}
      <div className="text-center space-y-2 pt-8 animate-fadeIn">
        <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full uppercase tracking-widest font-mono font-bold">Álbum Digital Digital en Vivo</span>
        <h1 className="font-serif text-2xl font-light text-stone-100">{boda.bride_name} & {boda.groom_name}</h1>
        <p className="text-xs text-purple-200/60 font-light max-w-xs mx-auto leading-relaxed">Captura momentos mágicos durante la fiesta. Tus capturas se proyectarán e integrarán al carrete de recuerdos oficial.</p>
      </div>

      {/* DISPARADOR DE CÁMARA NATIVO MÓVIL */}
      <div className="my-auto py-12 flex flex-col items-center justify-center space-y-6 animate-scaleUp">
        <label className="w-48 h-48 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-1 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all relative group select-none">
          <div className="w-full h-full bg-[#0d0a14] rounded-full flex flex-col items-center justify-center gap-2 border border-white/5">
            <span className="text-5xl group-hover:animate-bounce">{subiendo ? '⏱️' : '📸'}</span>
            <span className="text-[10px] uppercase font-mono font-black tracking-widest text-purple-300">
              {subiendo ? 'Subiendo...' : 'Abrir Cámara'}
            </span>
          </div>
          {/* Parámetro capture="environment" fuerza a abrir la cámara trasera del cel de inmediato */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            disabled={subiendo} 
            onChange={handleSubirFotoInvitado} 
            className="hidden" 
          />
        </label>

        {exito && (
          <p className="text-emerald-400 text-xs font-semibold animate-fadeIn bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
            🎉 ¡Fotografía guardada con éxito!
          </p>
        )}
      </div>

      {/* FOOTER */}
      <footer className="text-center pb-6 opacity-30 select-none">
        <p className="text-[9px] uppercase tracking-widest font-mono text-stone-400">Desarrollado de forma segura por clickypapel.com</p>
      </footer>

    </div>
  );
}