"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // 🛠️ Asegúrate de que esta ruta apunte a tu cliente de Supabase

export default function SelectorMusicaDashboard({ bodaSlug, currentMusicType, currentMusicUrl, onUpdateSuccess }) {
  const [tipoMusica, setTipoMusica] = useState(currentMusicType || 'default'); 
  const [cancionElegida, setCancionElegida] = useState(tipoMusica === 'default' ? currentMusicUrl : '/music/1-thousand-years.mp3');
  const [archivoMp3, setArchivoMp3] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubirMp3 = (e) => {
    const file = e.target.files[0];
    setError('');
    setExito(false);

    if (!file) return;

    if (file.type !== "audio/mpeg" && !file.name.endsWith('.mp3')) {
      setError("❌ Error: El archivo debe ser estrictamente formato .MP3");
      setArchivoMp3(null);
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("❌ El archivo es muy pesado. Máximo 8MB.");
      return;
    }

    setArchivoMp3(file);
  };

  // 🚀 Función mágica para guardar la configuración
  const handleGuardarConfiguracion = async () => {
    setCargando(true);
    setError('');
    setExito(false);

    let finalMusicUrl = cancionElegida;

    try {
      // CASO B: Si es música personalizada y subieron un archivo nuevo
      if (tipoMusica === 'custom' && archivoMp3) {
        // Creamos una ruta limpia dentro de la carpeta del cliente en tu bucket 'invitaciones'
        const nombreArchivo = `music-${Date.now()}.mp3`;
        const rutaStorage = `${bodaSlug}/musica/${nombreArchivo}`;

        // 1. Subimos el archivo MP3 al Storage de Supabase
        const { data: storageData, error: storageError } = await supabase.storage
          .from('invitaciones')
          .upload(rutaStorage, archivoMp3, { cacheControl: '3600', upsert: true });

        if (storageError) throw new Error(`Error en Storage: ${storageError.message}`);

        // 2. Construimos la URL pública del archivo subido
        const { data: urlData } = supabase.storage
          .from('invitaciones')
          .getPublicUrl(rutaStorage);

        finalMusicUrl = urlData.publicUrl;
      }

      // 3. Actualizamos la fila de la boda en PostgreSQL
      const { error: dbError } = await supabase
        .from('bodas')
        .update({
          music_type: tipoMusica,
          music_url: finalMusicUrl
        })
        .eq('slug', bodaSlug);

      if (dbError) throw new Error(`Error en Base de Datos: ${dbError.message}`);

      setExito(true);
      if (onUpdateSuccess) onUpdateSuccess(); // Callback opcional para refrescar la pantalla madre

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-stone-200 max-w-md space-y-6 shadow-xs">
      <div>
        <h3 className="font-serif text-lg text-stone-900">Música de Fondo</h3>
        <p className="text-stone-500 text-xs font-light">Elige la banda sonora para tu invitación digital.</p>
      </div>

      {/* Opciones Principales */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50 cursor-pointer">
          <input 
            type="radio" 
            name="music_type" 
            checked={tipoMusica === 'default'} 
            onChange={() => setTipoMusica('default')} 
            className="accent-amber-700"
          />
          <div>
            <span className="text-sm font-medium block">Canciones Gratis Incluidas</span>
            <span className="text-stone-400 text-xs font-light">Elige entre nuestras 5 opciones finas.</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/20 cursor-pointer">
          <input 
            type="radio" 
            name="music_type" 
            checked={tipoMusica === 'custom'} 
            onChange={() => setTipoMusica('custom')}
            className="accent-amber-700"
          />
          <div>
            <span className="text-sm font-medium block text-amber-900">Música Personalizada 👑</span>
            <span className="text-amber-700 font-mono text-[11px] font-bold bg-amber-100/60 px-1.5 py-0.5 rounded-sm">+ $350 MXN</span>
          </div>
        </label>
      </div>

      {/* --- RENDER DINÁMICO --- */}
      {tipoMusica === 'default' ? (
        <div className="space-y-2">
          <label className="text-xs font-medium text-stone-500 block">Selecciona tu canción:</label>
          <select 
            value={cancionElegida}
            onChange={(e) => setCancionElegida(e.target.value)}
            className="w-full text-sm p-2.5 rounded-lg border border-stone-200 bg-white cursor-pointer"
          >
            <option value="/music/1-thousand-years.mp3">1. Clásico Romántico (A Thousand Years)</option>
            <option value="/music/2-perfect-acoustic.mp3">2. Pop Acústico (Perfect - Guitarra)</option>
            <option value="/music/3-canon-in-d.mp3">3. Elegancia Tradicional (Canon en Re)</option>
            <option value="/music/4-can-help-falling.mp3">4. Vintage Emotivo (Can't Help Falling in Love)</option>
            <option value="/music/5-marry-me.mp3">5. Instrumental Dulce (Marry Me - Piano)</option>
          </select>
        </div>
      ) : (
        <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-dashed border-stone-300">
          <label className="text-xs font-medium text-stone-700 block">Sube tu archivo de música:</label>
          
          <input 
            type="file" 
            accept=".mp3,audio/mpeg" 
            onChange={handleSubirMp3}
            className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer w-full"
          />

          {archivoMp3 && (
            <p className="text-emerald-600 text-xs font-medium">✓ Archivo listo: {archivoMp3.name}</p>
          )}

          <p className="text-[10px] text-stone-400 font-light leading-normal">
            Nota: Para asegurar que la invitación cargue rápido, asegúrate de que sea un archivo .mp3 original.
          </p>
        </div>
      )}

      {/* Alertas de Estado */}
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
      {exito && <p className="text-emerald-600 text-xs font-medium">✨ ¡Configuración guardada exitosamente!</p>}

      <button 
        onClick={handleGuardarConfiguracion}
        disabled={cargando}
        className="w-full bg-stone-900 text-white py-3 rounded-xl text-xs uppercase font-semibold tracking-wider hover:bg-stone-800 transition-colors disabled:bg-stone-400"
      >
        {cargando ? "Guardando cambios..." : "Guardar Configuración Musical"}
      </button>
    </div>
  );
}