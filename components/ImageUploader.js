"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ImageUploader({ folderSlug, onUploadComplete, label = "Foto de Portada (Banner)" }) {
  const [subiendo, setSubiendo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const manejarSubida = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Mostrar una vista previa local instantánea para el cliente
    setPreviewUrl(URL.createObjectURL(file));
    setSubiendo(true);

    try {
      // 2. Crear un nombre único para el archivo (ej: portada-1718059200.jpg)
      const extension = file.name.split('.').pop();
      const nombreArchivo = `portada-${Date.now()}.${extension}`;
      
      // La ruta final dentro del bucket será: invitaciones/franciaco-y-fatima/portada-123.jpg
      const rutaArchivo = `${folderSlug}/${nombreArchivo}`;

      // 3. Subir el archivo físico al bucket 'invitaciones' que creamos en Supabase
      const { data, error } = await supabase.storage
        .from('invitaciones')
        .upload(rutaArchivo, file, {
          cacheControl: '3600',
          upsert: true // Si ya existe, lo reemplaza
        });

      if (error) throw error;

      // 4. Obtener la URL pública que generó Supabase
      const { data: { publicUrl } } = supabase.storage
        .from('invitaciones')
        .getPublicUrl(rutaArchivo);

      // 5. Le mandamos la URL al formulario principal para que la guarde en la tabla
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
      
      alert("¡Imagen subida con éxito! ✨");

    } catch (error) {
      console.error("Error al subir archivo:", error.message);
      alert("Hubo un problema al subir la imagen. Intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="space-y-2 border border-dashed border-stone-300 p-4 rounded-xl bg-stone-50 text-center">
      <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider">
        {label}
      </label>
      
      {/* Vista previa de la foto */}
      {previewUrl && (
        <div className="relative w-full h-40 mx-auto rounded-lg overflow-hidden bg-stone-200">
          <img 
            src={previewUrl} 
            alt="Vista previa" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Botón de acción */}
      <div className="flex items-center justify-center">
        <label className={`cursor-pointer text-xs bg-stone-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-stone-800 transition-colors ${subiendo ? "animate-pulse pointer-events-none" : ""}`}>
          {subiendo ? "Subiendo archivo... ⏳" : "Seleccionar Archivo"}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={manejarSubida} 
            disabled={subiendo}
          />
        </label>
      </div>
    </div>
  );
}