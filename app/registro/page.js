"use client";
import { useState, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function RegistroForm() {
  const searchParams = useSearchParams();

  // 🎯 Capturar intenciones de compra desde la URL
  const plan = searchParams.get('plan') || 'premium';
  const paletaUrl = searchParams.get('paleta') || 'cashmere';
  const fuenteUrl = searchParams.get('fuente') || 'clasica';
  const template = searchParams.get('template') || 'v2'; // Sugerimos la V2 por defecto ahora
  const musicaExtra = searchParams.get('musica') === 'custom';

  // 📝 Estados del Formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slugDeseado, setSlugDeseado] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [registrando, setRegistrando] = useState(false);

  // 🧮 Matemáticas del Checkout
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
    if (!slugDeseado) return alert("Por favor elige un enlace personalizado para tu boda.");
    
    setRegistrando(true);
    try {
      // 1. Verificamos si el enlace ya existe
      const { data: existeSlug } = await supabase
        .from('bodas')
        .select('slug')
        .eq('slug', slugDeseado)
        .maybeSingle();

      if (existeSlug) {
        setRegistrando(false);
        return alert(`⚠️ El enlace 'tugrandia.icu/${slugDeseado}' ya está ocupado. Por favor, intenta con otra combinación (ej. bruno-y-brisa-2026).`);
      }

      // 2. Insertamos la intención de compra
      const { error: errorBoda } = await supabase
        .from('bodas')
        .insert([{
          slug: slugDeseado,
          template_id: template,
          paleta_colores: paletaUrl, // Guardamos la paleta que eligió en la demo
          // nota: si tienes columna 'fuente_texto', agrégala aquí
          plan_tipo: plan,
          musica_extra: musicaExtra,
          bride_name: brideName.trim(),
          groom_name: groomName.trim(),
          music_url: musicaExtra ? '' : '/music/1-thousand-years.mp3'
        }]);

      if (errorBoda) throw errorBoda;

      // 3. Redirigimos al Checkout
      window.location.href = `/checkout?plan=${plan}&slug=${slugDeseado}&musica=${musicaExtra ? 'custom' : 'default'}`;

    } catch (err) {
      console.error(err);
      alert("Hubo un percance al procesar tu registro. Por favor, intenta de nuevo.");
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      
      {/* 🖼️ LADO IZQUIERDO: EL LUJO VISUAL (Se oculta en celulares) */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-stone-900 items-center justify-center overflow-hidden">
        {/* Foto Editorial Inmersiva */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40" />
        
        {/* Branding & Quote */}
        <div className="relative z-10 p-12 flex flex-col h-full justify-between w-full text-white">
          <div className="font-serif text-2xl tracking-widest font-light">
            clicky<span className="font-normal text-[#9a7b5c]">papel</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="font-serif text-5xl font-light leading-tight">El primer paso <br/>hacia el "Sí, acepto".</h2>
            <p className="text-sm font-light tracking-wide opacity-80 max-w-sm">
              Crea tu cuenta hoy y obtén acceso inmediato a tu panel de control, mesa de regalos y gestor de invitados.
            </p>
          </div>
          
          <div className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-2">
            <span>Seguridad cifrada</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>Soporte 24/7</span>
          </div>
        </div>
      </div>

      {/* 📝 LADO DERECHO: FORMULARIO Y RESUMEN */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl space-y-10">
          
          {/* Header del Formulario */}
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] bg-[#f5f0ea] text-[#9a7b5c] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Paso 1 de 2</span>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-light">Configura tu Boda</h1>
            <p className="text-sm text-stone-500 font-light">Llena los datos para apartar tu enlace y acceder al cobro seguro.</p>
          </div>

          {/* 🧾 TARJETA DE RESUMEN DE COMPRA */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">Plan Seleccionado</p>
              <p className="text-sm text-[#9a7b5c] font-serif capitalize">
                {plan === 'basicos' ? '💍 Digital Esencial' : plan === 'vip' ? '👑 VIP Celestial' : '🌟 Gran Día Premium'}
              </p>
              {musicaExtra && <p className="text-[10px] text-stone-500">+ Canción Especial MP3</p>}
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Total hoy</p>
              <p className="text-3xl font-light font-mono text-stone-900">${precioTotal.toLocaleString('es-MX')} <span className="text-sm opacity-50">MXN</span></p>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* ✍️ FORMULARIO DE CAPTURA */}
          <form onSubmit={handleCrearCuentaYOrden} className="space-y-6">
            
            {/* Bloque: Los Novios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Nombre de Ella</label>
                <input type="text" required value={brideName} onChange={(e) => setBrideName(e.target.value)} placeholder="Ej. Sofía" className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Nombre de Él</label>
                <input type="text" required value={groomName} onChange={(e) => setGroomName(e.target.value)} placeholder="Ej. Alejandro" className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm" />
              </div>
            </div>

            {/* Bloque: Enlace Web */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Tu Enlace Web Oficial</label>
              <div className="flex items-stretch shadow-sm rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#9a7b5c]/30 focus-within:border-[#9a7b5c] transition-all border border-stone-200 bg-white">
                <span className="px-4 flex items-center justify-center text-xs text-stone-400 font-mono select-none bg-stone-50 border-r border-stone-100">
                  tugrandia.icu/
                </span>
                <input type="text" required value={slugDeseado} onChange={(e) => handleSlugChange(e.target.value)} placeholder="sofia-y-alejandro" className="w-full px-3 py-3.5 text-sm focus:outline-none font-mono text-[#9a7b5c] placeholder:text-stone-300" />
              </div>
              <p className="text-[10px] text-stone-400 ml-1">Este será el link que enviarás a tus invitados por WhatsApp.</p>
            </div>

            {/* Bloque: Cuenta de Usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Correo Electrónico</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hola@correo.com" className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Crea una Contraseña</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm" />
              </div>
            </div>

            {/* Botón de Acción */}
            <div className="pt-6">
              <button type="submit" disabled={registrando} className="w-full bg-stone-900 hover:bg-[#9a7b5c] text-white text-xs md:text-sm uppercase font-bold tracking-widest py-4.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-center disabled:opacity-70 flex items-center justify-center gap-2">
                {registrando ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Preparando tu Espacio...
                  </>
                ) : (
                  `🔒 Continuar al Pago Seguro`
                )}
              </button>
              <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-widest">
                Pagos encriptados con seguridad de grado bancario.
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function RegistroCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center text-xs uppercase tracking-widest text-[#9a7b5c] font-mono animate-pulse">
        Conectando pasarela de seguridad...
      </div>
    }>
      <RegistroForm />
    </Suspense>
  );
}