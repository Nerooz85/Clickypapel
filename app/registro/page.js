"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { obtenerPlan, calcularTotal, formatearPesos } from '@/lib/precios';

const MUSICA_POR_DEFECTO = '/music/01-clasico-romantico.mp3';

function RegistroForm() {
  const searchParams = useSearchParams();

  const planId = searchParams.get('plan') || 'premium';
  const paletaUrl = searchParams.get('paleta') || 'cashmere';
  const template = searchParams.get('template') || 'v2';
  const musicaExtra = searchParams.get('musica') === 'custom';

  const plan = obtenerPlan(planId);
  const total = calcularTotal(planId, musicaExtra);

  const [tipoEvento, setTipoEvento] = useState('boda');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slugDeseado, setSlugDeseado] = useState('');
  const [nombrePrincipal, setNombrePrincipal] = useState('');
  const [nombreSecundario, setNombreSecundario] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [error, setError] = useState('');

  // Si ya tiene sesión (por ejemplo, volvió de Google), no le pedimos contraseña otra vez.
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const configuracionEvento = {
    boda: {
      titulo: 'Configura tu Boda',
      subtitulo: 'La antesala de tu gran día comienza aquí.',
      foto: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1000&auto=format&fit=crop',
      labels: ['Nombre de Ella', 'Nombre de Él'],
      placeholders: ['Ej. Sofía', 'Ej. Alejandro'],
      slugEjemplo: 'sofia-y-alejandro',
    },
    xvanos: {
      titulo: 'Tus XV Años',
      subtitulo: 'Crea una experiencia inolvidable para tus invitados.',
      foto: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=1000&auto=format&fit=crop',
      labels: ['Nombre de la Quinceañera'],
      placeholders: ['Ej. Valentina'],
      slugEjemplo: 'mis-xv-valentina',
    },
    baby: {
      titulo: 'Baby Shower',
      subtitulo: 'Celebremos la llegada de una nueva vida.',
      foto: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop',
      labels: ['Nombre del Bebé', 'Nombre de los Papás (opcional)'],
      placeholders: ['Ej. Baby Leo', 'Ej. Ana y Luis'],
      slugEjemplo: 'baby-shower-leo',
    },
    bautizo: {
      titulo: 'Bautizo',
      subtitulo: 'Reúne a tus seres queridos de forma elegante.',
      foto: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop',
      labels: ['Nombre del Festejado'],
      placeholders: ['Ej. Mateo'],
      slugEjemplo: 'bautizo-mateo',
    },
    despedida: {
      titulo: 'Despedida de Soltera',
      subtitulo: "El último gran festejo antes del 'Sí, acepto'.",
      foto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
      labels: ['Nombre de la Novia'],
      placeholders: ['Ej. Mariana'],
      slugEjemplo: 'despedida-mariana',
    },
  };

  const eventoActual = configuracionEvento[tipoEvento];

  const handleSlugChange = (val) => {
    const formateado = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita acentos
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setSlugDeseado(formateado);
  };

  const entrarConGoogle = async () => {
    const destino = `${window.location.origin}/registro?plan=${planId}&template=${template}&paleta=${paletaUrl}${musicaExtra ? '&musica=custom' : ''}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: destino },
    });
    if (error) setError('No pudimos conectar con Google. Intenta con tu correo.');
  };

  const crearCuentaYReservar = async (e) => {
    e.preventDefault();
    setError('');

    if (!slugDeseado) {
      setError('Elige el enlace de tu evento.');
      return;
    }

    setRegistrando(true);

    try {
      // 1. ¿El enlace está libre?
      const { data: ocupado } = await supabase
        .from('bodas')
        .select('slug')
        .eq('slug', slugDeseado)
        .maybeSingle();

      if (ocupado) {
        setError(`El enlace tugrandia.icu/${slugDeseado} ya está tomado. Prueba otra combinación.`);
        setRegistrando(false);
        return;
      }

      // 2. Cuenta de usuario (si no viene de Google)
      let usuario = sesion?.user || null;

      if (!usuario) {
        const { data, error: errorAuth } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });

        if (errorAuth) {
          if (errorAuth.message.includes('already registered')) {
            setError('Ese correo ya tiene cuenta. Entra desde el portal y crea tu evento desde ahí.');
          } else {
            setError(errorAuth.message);
          }
          setRegistrando(false);
          return;
        }

        // Sin sesión = Supabase está pidiendo confirmación por correo.
        if (!data.session) {
          setError('Te enviamos un correo para confirmar tu cuenta. Confírmalo y vuelve a este paso.');
          setRegistrando(false);
          return;
        }

        usuario = data.user;
      }

      // 3. Apartar el evento a nombre de ese usuario
      const { error: errorBoda } = await supabase.from('bodas').insert([
        {
          user_id: usuario.id,
          slug: slugDeseado,
          tipo_evento: tipoEvento,
          template_id: template,
          paleta_colores_ui: paletaUrl,
          plan_tipo: planId,
          musica_extra: musicaExtra,
          pago_confirmado: false,
          bride_name: nombrePrincipal.trim(),
          groom_name: nombreSecundario.trim(),
          music_url: musicaExtra ? '' : MUSICA_POR_DEFECTO,
        },
      ]);

      if (errorBoda) throw errorBoda;

      window.location.href = `/checkout?plan=${planId}&slug=${slugDeseado}&musica=${musicaExtra ? 'custom' : 'default'}`;
    } catch (err) {
      console.error(err);
      setError('No pudimos guardar tu evento. Intenta de nuevo en un momento.');
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white relative">
      {/* Columna visual */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-stone-900 items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-all duration-1000"
          style={{ backgroundImage: `url('${eventoActual.foto}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40" />

        <div className="relative z-10 p-12 flex flex-col h-full justify-between w-full text-white">
          <div className="font-serif text-2xl tracking-widest font-light">
            clicky<span className="font-normal text-[#9a7b5c]">papel</span>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-5xl font-light leading-tight">{eventoActual.titulo}</h2>
            <p className="text-sm font-light tracking-wide opacity-80 max-w-sm">{eventoActual.subtitulo}</p>
          </div>

          <div className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-2">
            <span>Pago seguro con Stripe</span>
            <span className="w-1 h-1 bg-white rounded-full" />
            <span>Soporte por WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="w-full lg:w-7/12 flex flex-col items-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-xl flex justify-end gap-4 mb-8 text-[10px] uppercase tracking-widest font-bold">
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors py-2">
            ← Volver al inicio
          </Link>
          <Link
            href="/bruno-y-brisa"
            className="bg-[#f5f0ea] text-[#9a7b5c] hover:bg-[#e3d5c8] px-4 py-2 rounded-full transition-colors"
          >
            Ver ejemplos
          </Link>
        </div>

        <div className="w-full max-w-xl space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] bg-[#f5f0ea] text-[#9a7b5c] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Paso 1 de 2
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-light">Aparta tu enlace</h1>
            <p className="text-sm text-stone-500 font-light">
              Llena tus datos para reservar la dirección de tu evento.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <hr className="border-stone-100" />

          <form onSubmit={crearCuentaYReservar} className="space-y-6">
            {/* Tipo de evento */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1 block">
                ¿Qué vamos a celebrar?
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'boda', icono: '💍', texto: 'Boda' },
                  { id: 'xvanos', icono: '👑', texto: 'XV Años' },
                  { id: 'baby', icono: '🍼', texto: 'Baby Shower' },
                  { id: 'bautizo', icono: '🕊️', texto: 'Bautizo' },
                  { id: 'despedida', icono: '🥂', texto: 'Despedida' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTipoEvento(item.id);
                      setNombrePrincipal('');
                      setNombreSecundario('');
                    }}
                    className={`flex-1 min-w-[90px] py-2.5 px-2 rounded-xl text-[10px] md:text-[11px] uppercase tracking-wider font-bold transition-all border cursor-pointer flex flex-col items-center gap-1 ${
                      tipoEvento === item.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                        : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-base">{item.icono}</span>
                    {item.texto}
                  </button>
                ))}
              </div>
            </div>

            {/* Nombres */}
            <div className={`grid grid-cols-1 ${eventoActual.labels.length > 1 ? 'md:grid-cols-2' : ''} gap-5`}>
              <div className="space-y-1.5">
                <label htmlFor="nombre1" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                  {eventoActual.labels[0]}
                </label>
                <input
                  id="nombre1"
                  type="text"
                  required
                  value={nombrePrincipal}
                  onChange={(e) => setNombrePrincipal(e.target.value)}
                  placeholder={eventoActual.placeholders[0]}
                  className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm"
                />
              </div>

              {eventoActual.labels[1] && (
                <div className="space-y-1.5">
                  <label htmlFor="nombre2" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                    {eventoActual.labels[1]}
                  </label>
                  <input
                    id="nombre2"
                    type="text"
                    required={tipoEvento === 'boda'}
                    value={nombreSecundario}
                    onChange={(e) => setNombreSecundario(e.target.value)}
                    placeholder={eventoActual.placeholders[1]}
                    className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Enlace */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                Tu enlace
              </label>
              <div className="flex items-stretch shadow-sm rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#9a7b5c]/30 border border-stone-200 bg-white">
                <span className="px-3 md:px-4 flex items-center justify-center text-xs text-stone-400 font-mono select-none bg-stone-50 border-r border-stone-100">
                  tugrandia.icu/
                </span>
                <input
                  id="slug"
                  type="text"
                  required
                  value={slugDeseado}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder={eventoActual.slugEjemplo}
                  className="w-full px-3 py-3.5 text-sm focus:outline-none font-mono text-[#9a7b5c] placeholder:text-stone-300"
                />
              </div>
            </div>

            {/* Cuenta */}
            {sesion ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Sesión iniciada</p>
                  <p className="text-xs text-emerald-800 font-medium">{sesion.user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => { await supabase.auth.signOut(); setSesion(null); }}
                  className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 underline cursor-pointer"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <button
                  type="button"
                  onClick={entrarConGoogle}
                  className="w-full flex items-center justify-center gap-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2 5.1-4.4 6.7v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.2z" />
                    <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.5 46 24 46z" />
                    <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-2.9.7-4.3v-5.7H4.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7.3-5.6z" />
                    <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.8 4.5 13.9l7.3 5.7c1.7-5.2 6.5-8.9 12.2-8.9z" />
                  </svg>
                  Continuar con Google
                </button>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-stone-100" />
                  <span className="mx-4 text-[10px] text-stone-300 font-mono uppercase">o con tu correo</span>
                  <div className="flex-grow border-t border-stone-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="correo" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                      Correo
                    </label>
                    <input
                      id="correo"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hola@correo.com"
                      className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="pass" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                      Contraseña
                    </label>
                    <input
                      id="pass"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resumen */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60 shadow-sm flex items-center justify-between gap-4 mt-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Plan elegido</p>
                <p className="text-xs md:text-sm text-[#9a7b5c] font-bold">
                  {plan.emoji} {plan.nombre}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-0.5">Total</p>
                <p className="text-xl md:text-2xl font-bold font-mono text-stone-900">
                  {formatearPesos(total)} <span className="text-[10px] opacity-50">MXN</span>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={registrando}
              className="w-full bg-stone-900 hover:bg-[#9a7b5c] text-white text-xs md:text-sm uppercase font-bold tracking-widest py-4 rounded-xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {registrando ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Apartando tu enlace…
                </>
              ) : (
                'Continuar al pago'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs uppercase tracking-widest text-[#9a7b5c] font-mono animate-pulse">
          Cargando…
        </div>
      }
    >
      <RegistroForm />
    </Suspense>
  );
}
