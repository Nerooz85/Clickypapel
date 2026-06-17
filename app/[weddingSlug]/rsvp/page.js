"use client";
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function RSVPPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const invitadoId = searchParams.get('id'); // ID opcional si llega por QR directo

  const [invitado, setInvitado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Buscar invitado en Supabase
  const buscarInvitado = async (nombre) => {
    if (nombre.length < 3) return;
    setCargando(true);
    const { data, error } = await supabase
      .from('invitados')
      .select('*')
      .eq('boda_slug', slug)
      .ilike('nombre_invitado', `%${nombre}%`)
      .maybeSingle();

    if (data) setInvitado(data);
    setCargando(false);
  };

  const confirmarAsistencia = async (estado) => {
    setCargando(true);
    const { error } = await supabase
      .from('invitados')
      .update({ estado: estado, pases_confirmados: estado === 'confirmado' ? invitado.pases_totales : 0 })
      .eq('id', invitado.id);

    if (!error) {
      setMensaje(estado === 'confirmado' ? '¡Gracias! Tu asistencia ha sido confirmada. ✨' : 'Hemos recibido tu respuesta. ¡Te extrañaremos! 🤍');
    }
    setCargando(false);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl border border-stone-100 text-center space-y-8">
        
        {!invitado ? (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl text-stone-900">Confirmar Asistencia</h1>
            <p className="text-sm text-stone-500 font-light">Escribe el nombre de tu familia para verificar tu lugar.</p>
            <input 
              type="text" 
              placeholder="Ej. Familia García"
              className="w-full px-4 py-4 border rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30"
              onChange={(e) => {
                setBusqueda(e.target.value);
                buscarInvitado(e.target.value);
              }}
            />
            {cargando && <p className="text-[10px] uppercase tracking-widest text-amber-700 animate-pulse">Buscando en la lista...</p>}
          </div>
        ) : mensaje ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 space-y-4">
            <div className="text-4xl">✨</div>
            <p className="font-serif text-xl text-stone-800">{mensaje}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="font-serif text-xl">¡Hola, {invitado.nombre_invitado}!</h2>
            <p className="text-sm text-stone-500">Se han reservado <span className="font-bold text-stone-900">{invitado.pases_totales} lugares</span> para ustedes.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => confirmarAsistencia('confirmado')}
                className="w-full bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#9a7b5c] transition-all"
              >
                Confirmar Asistencia
              </button>
              <button 
                onClick={() => confirmarAsistencia('declinado')}
                className="w-full bg-stone-100 text-stone-600 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
              >
                No podré asistir
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}