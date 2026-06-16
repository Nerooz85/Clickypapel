"use client";
import { useState, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function RegistroForm() {
  const searchParams = useSearchParams();

  // 🎯 Capturar intenciones de compra desde la URL
  const plan = searchParams.get('plan') || 'premium';
  const paletaUrl = searchParams.get('paleta') || 'cashmere';
  const template = searchParams.get('template') || 'v2'; 
  const musicaExtra = searchParams.get('musica') === 'custom';

  // 🎭 ESTADO DINÁMICO DEL EVENTO (El secreto para vender a todos los nichos)
  const [tipoEvento, setTipoEvento] = useState('boda');

  // 📝 Estados del Formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slugDeseado, setSlugDeseado] = useState('');
  
  // Usamos nombres genéricos en el estado para adaptarnos a cualquier evento
  const [nombrePrincipal, setNombrePrincipal] = useState('');
  const [nombreSecundario, setNombreSecundario] = useState('');
  const [registrando, setRegistrando] = useState(false);

  // 🧮 Matemáticas del Checkout
  const precios = { basicos: 890, premium: 1490, vip: 2490 };
  const precioBase = precios[plan] || 1490;
  const precioMusica = musicaExtra ? 350 : 0;
  const precioTotal = precioBase + precioMusica;

  // 📖 DICCIONARIO VISUAL: Cambia fotos y textos según el evento elegido
  const configuracionEvento = {
    boda: {
      titulo: "Configura tu Boda",
      subtitulo: "La antesala de tu gran día comienza aquí.",
      foto: "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1000&auto=format&fit=crop",
      labels: ["Nombre de Ella", "Nombre de Él"],
      placeholders: ["Ej. Sofía", "Ej. Alejandro"],
      slugEjemplo: "sofia-y-alejandro"
    },
    xvanos: {
      titulo: "Tus XV Años",
      subtitulo: "Crea una experiencia inolvidable para tus invitados.",
      foto: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=1000&auto=format&fit=crop",
      labels: ["Nombre de la Quinceañera"],
      placeholders: ["Ej. Valentina"],
      slugEjemplo: "mis-xv-valentina"
    },
    baby: {
      titulo: "Baby Shower",
      subtitulo: "Celebremos la llegada de una nueva vida.",
      foto: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop",
      labels: ["Nombre del Bebé", "Nombre de los Padres (Opcional)"],
      placeholders: ["Ej. Baby Leo", "Ej. Ana y Luis"],
      slugEjemplo: "baby-shower-leo"
    },
    bautizo: {
      titulo: "Bautizo / Shower",
      subtitulo: "Reúne a tus seres queridos de forma elegante.",
      foto: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop",
      labels: ["Nombre del Festejado/a"],
      placeholders: ["Ej. Mateo"],
      slugEjemplo: "bautizo-mateo"
    }
  };

  const eventoActual = configuracionEvento[tipoEvento];

  const handleSlugChange = (val) => {
    const formateado = val.toLowerCase().replace(/[^a-z0-9-_]/g, '').trim();
    setSlugDeseado(formateado);
  };

  const handleCrearCuentaYOrden = async (e) => {
    e.preventDefault();
    if (!slugDeseado) return alert("Por favor elige un enlace personalizado para tu evento.");
    
    setRegistrando(true);
    try {
      const { data: existeSlug } = await supabase
        .from('bodas')
        .select('slug')
        .eq('slug', slugDeseado)
        .maybeSingle();

      if (existeSlug) {
        setRegistrando(false);
        return alert(`⚠️ El enlace 'tugrandia.icu/${slugDeseado}' ya está ocupado. Por favor, intenta con otra combinación.`);
      }

      // 🧠 TRUCO DE SAAS: Guardamos en las columnas existentes (bride_name/groom_name) 
      // sin importar si es boda, XV o bautizo, para no romper la base de datos.
      const { error: errorBoda } = await supabase
        .from('bodas')
        .insert([{
          slug: slugDeseado,
          template_id: template,
          paleta_colores: paletaUrl,
          plan_tipo: plan,
          musica_extra: musicaExtra,
          bride_name: nombrePrincipal.trim(), // Aquí entra la Novia, la Quinceañera o el Bebé
          groom_name: nombreSecundario.trim(), // Aquí entra el Novio, los Padres, o queda vacío
          music_url: musicaExtra ? '' : '/music/1-thousand-years.mp3'
        }]);

      if (errorBoda) throw errorBoda;

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
      
      {/* 🖼️ LADO IZQUIERDO: EL LUJO VISUAL QUE CAMBIA SEGÚN EL EVENTO */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-stone-900 items-center justify-center overflow-hidden transition-all duration-1000">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-all duration-1000 hover:scale-105"
          style={{ backgroundImage: `url('${eventoActual.foto}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40" />
        
        <div className="relative z-10 p-12 flex flex-col h-full justify-between w-full text-white">
          <div className="font-serif text-2xl tracking-widest font-light">
            clicky<span className="font-normal text-[#9a7b5c]">papel</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="font-serif text-5xl font-light leading-tight">{eventoActual.titulo}</h2>
            <p className="text-sm font-light tracking-wide opacity-80 max-w-sm">
              {eventoActual.subtitulo} Crea tu cuenta hoy y obtén acceso inmediato a tu panel de control y confirmación de invitados.
            </p>
          </div>
          
          <div className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-2">
            <span>Seguridad cifrada</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>Soporte 24/7</span>
          </div>
        </div>
      </div>

      {/* 📝 LADO DERECHO: FORMULARIO MUTANTE */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl space-y-8">
          
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] bg-[#f5f0ea] text-[#9a7b5c] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Paso 1 de 2</span>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-light">Reserva tu Espacio</h1>
            <p className="text-sm text-stone-500 font-light">Llena los datos para apartar tu enlace y acceder al cobro seguro.</p>
          </div>

          <hr className="border-stone-100" />

          {/* ✍️ FORMULARIO DE CAPTURA */}
          <form onSubmit={handleCrearCuentaYOrden} className="space-y-6">
            
            {/* 1. SELECTOR DE EVENTO INTELIGENTE */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">¿Qué vamos a celebrar?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'boda', icono: '💍', texto: 'Boda' },
                  { id: 'xvanos', icono: '👑', texto: 'XV Años' },
                  { id: 'baby', icono: '🍼', texto: 'Baby Shower' },
                  { id: 'bautizo', icono: '🕊️', texto: 'Bautizo' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTipoEvento(item.id);
                      setNombrePrincipal(''); // Limpiamos campos al cambiar
                      setNombreSecundario('');
                    }}
                    className={`py-2.5 px-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all border cursor-pointer flex flex-col items-center gap-1 ${
                      tipoEvento === item.id ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-base">{item.icono}</span>
                    {item.texto}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CAMPOS DE NOMBRES DINÁMICOS */}
            <div className={`grid grid-cols-1 ${eventoActual.labels.length > 1 ? 'md:grid-cols-2' : ''} gap-5`}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">{eventoActual.labels[0]}</label>
                <input type="text" required value={nombrePrincipal} onChange={(e) => setNombrePrincipal(e.target.value)} placeholder={eventoActual.placeholders[0]} className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm" />
              </div>
              
              {eventoActual.labels[1] && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">{eventoActual.labels[1]}</label>
                  <input type="text" required={tipoEvento === 'boda'} value={nombreSecundario} onChange={(e) => setNombreSecundario(e.target.value)} placeholder={eventoActual.placeholders[1]} className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm" />
                </div>
              )}
            </div>

            {/* 3. ENLACE WEB */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Tu Enlace Web Oficial</label>
              <div className="flex items-stretch shadow-sm rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#9a7b5c]/30 focus-within:border-[#9a7b5c] transition-all border border-stone-200 bg-white">
                <span className="px-3 md:px-4 flex items-center justify-center text-xs text-stone-400 font-mono select-none bg-stone-50 border-r border-stone-100">
                  tugrandia.icu/
                </span>
                <input type="text" required value={slugDeseado} onChange={(e) => handleSlugChange(e.target.value)} placeholder={eventoActual.slugEjemplo} className="w-full px-3 py-3.5 text-sm focus:outline-none font-mono text-[#9a7b5c] placeholder:text-stone-300" />
              </div>
            </div>

            {/* 4. CUENTA DE USUARIO */}
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

            {/* 🧾 TARJETA RESUMEN (Pegada al botón de pago) */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60 shadow-sm flex flex-row items-center justify-between gap-4 mt-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Plan Elegido</p>
                <p className="text-xs md:text-sm text-[#9a7b5c] font-bold capitalize">
                  {plan === 'basicos' ? '💍 Digital Esencial' : plan === 'vip' ? '👑 VIP Celestial' : '🌟 Gran Día Premium'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">Total a Pagar</p>
                <p className="text-xl md:text-2xl font-bold font-mono text-stone-900">${precioTotal.toLocaleString('es-MX')} <span className="text-[10px] opacity-50">MXN</span></p>
              </div>
            </div>

            {/* BOTÓN DE PAGO */}
            <div className="pt-2">
              <button type="submit" disabled={registrando} className="w-full bg-stone-900 hover:bg-[#9a7b5c] text-white text-xs md:text-sm uppercase font-bold tracking-widest py-4.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-center disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer">
                {registrando ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generando Enlace...
                  </>
                ) : (
                  `🔒 Continuar al Pago Seguro`
                )}
              </button>
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