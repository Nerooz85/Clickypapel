"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false); // Alternar entre Login y Registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const authSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        // 🚀 REGISTRO DE NUEVO USUARIO
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Redirige automáticamente al dashboard al confirmar (si tienes activada la confirmación por correo)
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        
        alert("¡Cuenta creada con éxito! Puedes ingresar ahora. ✨");
        setIsRegister(false);
      } else {
        // 🔒 INICIO DE SESIÓN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Si el login es correcto, lo mandamos directo al Dashboard privado
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error de autenticación:", error.message);
      // Traducción amigable de errores comunes de Supabase
      if (error.message.includes("already registered")) {
        setErrorMsg("Este correo ya está registrado. Intenta iniciar sesión.");
      } else if (error.message.includes("Invalid login credentials")) {
        setErrorMsg("El correo o la contraseña son incorrectos.");
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col justify-center items-center px-4">
      
      {/* Contenedor principal con estética Clickypapel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-stone-200/60 rounded-3xl shadow-xs overflow-hidden p-8 md:p-10 space-y-6"
      >
        {/* Logo / Encabezado */}
        <div className="text-center space-y-2">
          <span className="font-serif text-2xl tracking-wider font-light text-stone-900">
            clicky<span className="font-normal text-amber-600">papel</span>.com
          </span>
          <p className="text-stone-400 text-xs uppercase tracking-widest font-light">
            {isRegister ? "Crea tu cuenta boutique" : "Portal de Novios"}
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={authSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com" 
              required 
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 bg-stone-50/50" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 bg-stone-50/50" 
            />
          </div>

          {/* Botón de Acción Principal */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs md:text-sm py-3.5 rounded-xl transition-all shadow-sm uppercase tracking-wider disabled:bg-stone-400 cursor-pointer pt-4"
          >
            {cargando ? "Procesando... ⏳" : isRegister ? "Registrar mi Cuenta" : "Ingresar al Dashboard"}
          </button>
        </form>

        {/* Separador visual */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-stone-100"></div>
          <span className="flex-shrink mx-4 text-[10px] text-stone-300 font-mono uppercase">o</span>
          <div className="flex-grow border-t border-stone-100"></div>
        </div>

        {/* Switcher para cambiar entre Login y Registro */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium underline transition-all cursor-pointer"
          >
            {isRegister ? "¿Ya tienes cuenta? Inicia Sesión" : "¿Eres nuevo? Regístrate aquí"}
          </button>
        </div>
      </motion.div>

      {/* Footer sutil */}
      <p className="text-stone-400 text-[11px] mt-6 font-light">
        Al continuar, aceptas los términos de servicio de clickypapel.com
      </p>
    </div>
  );
}