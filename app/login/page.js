"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();

  const [modo, setModo] = useState('entrar'); // 'entrar' | 'crear'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  // Si ya trae sesión (o acaba de volver de Google), lo mandamos al panel.
  useEffect(() => {
    let activo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!activo) return;
      if (data.session) router.replace('/dashboard');
      else setVerificandoSesion(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((evento, sesion) => {
      if (sesion && evento === 'SIGNED_IN') router.replace('/dashboard');
    });

    return () => {
      activo = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const traducirError = (mensaje = '') => {
    if (mensaje.includes('already registered')) return 'Ese correo ya tiene cuenta. Inicia sesión.';
    if (mensaje.includes('Invalid login credentials')) return 'El correo o la contraseña no coinciden.';
    if (mensaje.includes('Email not confirmed')) return 'Falta confirmar tu correo. Revisa tu bandeja.';
    if (mensaje.includes('at least 6')) return 'La contraseña necesita al menos 6 caracteres.';
    return mensaje || 'Algo salió mal. Intenta de nuevo.';
  };

  const entrarConGoogle = async () => {
    setError('');
    setCargando(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(traducirError(error.message));
      setCargando(false);
    }
    // Si todo va bien, el navegador se va a Google. No hay nada más que hacer aquí.
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');
    setCargando(true);

    try {
      if (modo === 'crear') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;

        // Con confirmación por correo activada, signUp no devuelve sesión.
        if (data.session) {
          router.replace('/dashboard');
        } else {
          setAviso('Te enviamos un correo para confirmar tu cuenta.');
          setModo('entrar');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace('/dashboard');
      }
    } catch (err) {
      setError(traducirError(err.message));
    } finally {
      setCargando(false);
    }
  };

  if (verificandoSesion) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-stone-200/60 rounded-3xl shadow-sm overflow-hidden p-8 md:p-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <Link href="/" className="font-serif text-2xl tracking-wider font-light text-stone-900 block">
            clicky<span className="font-normal text-amber-600">papel</span>
          </Link>
          <p className="text-stone-400 text-xs uppercase tracking-widest font-light">
            {modo === 'crear' ? 'Crea tu cuenta' : 'Entra a tu panel'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}
        {aviso && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs text-center font-medium">
            {aviso}
          </div>
        )}

        {/* Google primero: es el camino que la mayoría va a tomar en celular */}
        <button
          type="button"
          onClick={entrarConGoogle}
          disabled={cargando}
          className="w-full flex items-center justify-center gap-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium py-3.5 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
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

        <form onSubmit={enviarFormulario} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Correo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hola@correo.com"
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 bg-stone-50/50"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete={modo === 'crear' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 bg-stone-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs md:text-sm py-3.5 rounded-xl transition-all uppercase tracking-wider disabled:bg-stone-400 cursor-pointer"
          >
            {cargando ? 'Un momento…' : modo === 'crear' ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => { setModo(modo === 'crear' ? 'entrar' : 'crear'); setError(''); setAviso(''); }}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium underline cursor-pointer"
          >
            {modo === 'crear' ? '¿Ya tienes cuenta? Entra aquí' : '¿Eres nuevo? Crea tu cuenta'}
          </button>
        </div>
      </motion.div>

      <p className="text-stone-400 text-[11px] mt-6 font-light">
        Al continuar aceptas los términos de clickypapel.com
      </p>
    </div>
  );
}
