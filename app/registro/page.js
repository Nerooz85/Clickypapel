"use client";
import { useState, Suspense } from 'react'; // 1. Importamos Suspense nativo
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 📝 COMPONENTE HIJO CON TODA TU LÓGICA COMERCIAL
function RegistroForm() {
  const searchParams = useSearchParams();

  // Capturar intenciones de compra desde la URL
  const plan = searchParams.get('plan') || 'premium';
  const template = searchParams.get('template') || 'romantico-clasico';
  const musicaExtra = searchParams.get('musica') === 'custom';

  // Estados del Formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slugDeseado, setSlugDeseado] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [registrando, setRegistrando] = useState(false);

  // Matemáticas del Checkout
  const precios = { basicos: 890, premium: 1490, vip: 2490 };
  const precioBase = precios[plan] || 1490;
  const precioMusica = musicaExtra ? 350 : 0;
  const precioTotal = precioBase + precioMusica;

  const handleSlugChange = (val) => {
    const formateado = val
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '')
      .trim();
    setSlugDeseado(formateado);
  };

  const handleCrearCuentaYOrden = async (e) => {
    e.preventDefault();
    if (!slugDeseado) return alert("Por favor elige un enlace personalizado.");
    
    setRegistrando(true);
    try {
      const { data: existeSlug } = await supabase
        .from('bodas')
        .select('slug')
        .eq('slug', slugDeseado)
        .maybeSingle();

      if (existeSlug) {
        setRegistrando(false);
        return alert(`⚠️ El enlace 'clickypapel.com/${slugDeseado}' ya está ocupado. Intenta con otra combinación.`);
      }

      const { error: errorBoda } = await supabase
        .from('bodas')
        .insert([{
          slug: slugDeseado,
          template_id: template,
          plan_tipo: plan,
          musica_extra: musicaExtra,
          bride_name: brideName.trim(),
          groom_name: groomName.trim(),
          music_url: musicaExtra ? '' : '/music/1-thousand-years.mp3'
        }]);

      if (errorBoda) throw errorBoda;

      alert(`✨ ¡Espacio reservado con éxito! Avanzando al pago de $${precioTotal} MXN...`);
      window.location.href = `/dashboard?slug=${slugDeseado}`;

    } catch (err) {
      console.error(err);
      alert("Hubo un percance al procesar tu registro.");
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 overflow-hidden">
      {/* FORMULARIO */}
      <form onSubmit={handleCrearCuentaYOrden} className="p-6 md:p-10 md:col-span-3 space-y-6 text-left">
        <div className="space-y-1">
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Alta de Cuenta</span>
          <h1 className="font-serif text-2xl text-stone-900 font-light">Comienza tu Invitación Inteligente</h1>
          <p className="text-xs text-stone-400 font-light">Estás a unos clics de asegurar tu espacio digital.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600">Nombre de Ella</label>
              <input type="text" required value={brideName} onChange={(e) => setBrideName(e.target.value)} placeholder="Ej. Brisa" className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-stone-50/40 focus:outline-none focus:border-amber-700" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600">Nombre de Él</label>
              <input type="text" required value={groomName} onChange={(e) => setGroomName(e.target.value)} placeholder="Ej. Bruno" className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-stone-50/40 focus:outline-none focus:border-amber-700" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-600">Tu Enlace Personalizado Deseado</label>
            <div className="flex items-center">
              <span className="bg-stone-100 border border-r-0 border-stone-200 px-3 py-2.5 rounded-l-xl text-xs text-stone-400 font-mono select-none">clickypapel.com/</span>
              <input type="text" required value={slugDeseado} onChange={(e) => handleSlugChange(e.target.value)} placeholder="tu-boda" className="w-full px-3.5 py-2.5 border rounded-r-xl text-xs bg-stone-50/40 focus:outline-none focus:border-amber-700 font-mono text-amber-900 font-bold" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-600">Correo Electrónico</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="novios@correo.com" className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-stone-50/40 focus:outline-none focus:border-amber-700" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-600">Contraseña de Acceso</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-stone-50/40 focus:outline-none focus:border-amber-700" />
          </div>
        </div>

        <button type="submit" disabled={registrando} className="w-full bg-stone-950 hover:bg-amber-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-colors text-center disabled:opacity-50">
          {registrando ? 'Verificando Disponibilidad...' : `💳 Proceder al Pago • $${precioTotal.toLocaleString('es-MX')} MXN`}
        </button>
      </form>

      {/* RESUMEN DE COMPRA LADO DERECHO */}
      <div className="bg-stone-50 p-6 md:p-10 md:col-span-2 border-t md:border-t-0 md:border-l border-stone-100 flex flex-col justify-between text-left">
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-lg text-stone-900 font-medium">Resumen de Orden</h3>
            <hr className="border-stone-200/60 mt-2" />
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-stone-800">Paquete Digital Seleccionado</p>
                <p className="text-[10px] text-stone-400 font-mono capitalize">Plan: {plan}</p>
              </div>
              <span className="font-mono font-bold text-stone-700">${precioBase.toLocaleString('es-MX')}</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-stone-800">Estilo Visual Base</p>
                <p className="text-[10px] text-stone-400 font-mono capitalize">{template}</p>
              </div>
              <span className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-sm font-bold">Incluido</span>
            </div>

            {musicaExtra && (
              <div className="flex justify-between items-start text-purple-950">
                <div>
                  <p className="font-bold">Add-on: Canción Especial MP3 🎵</p>
                </div>
                <span className="font-mono font-bold">${precioMusica}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200/60 flex items-center justify-between mt-6 md:mt-0">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Total a Pagar:</span>
            <span className="text-2xl font-mono font-black text-stone-900">${precioTotal.toLocaleString('es-MX')} MXN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 👑 COMPONENTE PADRE DE EXPORTACIÓN QUE BLINDA LA PÁGINA CON SUSPENSE
export default function RegistroCheckoutPage() {
  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex items-center justify-center p-4 font-sans antialiased">
      <Suspense fallback={
        <div className="text-xs uppercase tracking-widest text-stone-400 font-mono animate-pulse">
          Preparando tu pasarela de cobro seguro... ✨
        </div>
      }>
        <RegistroForm />
      </Suspense>
    </div>
  );
}