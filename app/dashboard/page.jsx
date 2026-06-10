"use client";
import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { motion, AnimatePresence } from 'framer-motion';
// 1. IMPORTAMOS TU CONEXIÓN SEGURA DE SUPABASE
import { supabase } from '@/lib/supabase'; 

export default function DashboardNovios() {
  const [activeTab, setActiveTab] = useState('basicos');
  const [guardando, setGuardando] = useState(false);
  // Estado para capturar la URL de la imagen subida a Supabase Storage
  const [coverImage, setCoverImage] = useState('');
  
  // Estado que recolecta toda la información de la boda
  const [formData, setFormData] = useState({
    groomName: '', brideName: '', eventDate: '', welcomePhrase: '',
    ceremoniaHora: '', ceremoniaLugar: '', ceremoniaMapsUrl: '',
    recepcionHora: '', recepcionLugar: '', recepcionMapsUrl: '',
    codigoVestimenta: 'Formal / Gala',
    banco: '', titular: '', clabe: '', amazonUrl: '', liverpoolUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. FUNCIÓN ASÍNCRONA PARA GUARDAR EN SUPABASE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    // Creamos un slug limpio para la URL basándonos en sus nombres
    const slugUrl = `${formData.groomName.toLowerCase()}-y-${formData.brideName.toLowerCase()}`.replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('bodas') // Tu nueva tabla de bodas
      .insert([
        {
          groom_name: formData.groomName,
          bride_name: formData.brideName,
          event_date: formData.eventDate,
          welcome_phrase: formData.welcomePhrase,
          ceremonia_hora: formData.ceremoniaHora,
          ceremonia_lugar: formData.ceremoniaLugar,
          ceremonia_maps_url: formData.ceremoniaMapsUrl,
          recepcion_hora: formData.recepcionHora,
          recepcion_lugar: formData.recepcionLugar,
          recepcion_maps_url: formData.recepcionMapsUrl,
          codigo_vestimenta: formData.codigoVestimenta,
          banco: formData.banco,
          titular: formData.titular,
          clabe: formData.clabe,
          amazon_url: formData.amazonUrl,
          liverpool_url: formData.liverpoolUrl,
          slug: slugUrl,
          cover_image: coverImage // 📸 Guardamos la URL de la foto en la columna correspondiente
        }
      ]);

    setGuardando(false);

    if (error) {
      console.error("Error al guardar la boda:", error.message);
      alert("Hubo un error al guardar tu configuración. Intenta de nuevo.");
    } else {
      alert(`¡Tu Gran Día ha sido guardado y activado! 🚀 URL generada: tugrandia.icu/${slugUrl}`);
    }
  };

  const tabs = [
    { id: 'basicos', label: '💍 Datos Básicos' },
    { id: 'logistica', label: '⛪ Lugar y Hora' },
    { id: 'regalos', label: '🎁 Regalos y Efectivo' }
  ];

  // Generamos un slug temporal en tiempo real para nombrar la carpeta de la foto antes de guardar
  const tempSlug = `${formData.groomName || 'boda'}-${formData.brideName || 'nueva'}`.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 font-sans text-stone-800">
      <div className="max-w-3xl mx-auto bg-white border border-stone-200/60 rounded-3xl shadow-xs overflow-hidden">
        
        {/* Encabezado del Formulario */}
        <div className="bg-stone-900 p-8 text-white text-center space-y-2">
          <h1 className="font-serif text-2xl md:text-3xl font-light tracking-wide">Configura Tu Gran Día</h1>
          <p className="text-stone-400 text-xs md:text-sm font-light">Llena los campos para diseñar tu invitación interactiva al instante.</p>
        </div>

        {/* Pestañas de Navegación Animadas */}
        <div className="flex border-b border-stone-100 bg-stone-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-xs md:text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-amber-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeDashboardTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-600" />
              )}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          <AnimatePresence mode="wait">
            
            {/* PESTAÑA 1: DATOS BÁSICOS */}
            {activeTab === 'basicos' && (
              <motion.div
                key="basicos" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Nombre del Novio</label>
                    <input type="text" name="groomName" value={formData.groomName} onChange={handleChange} placeholder="Ej. Abiel" required className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Nombre de la Novia</label>
                    <input type="text" name="brideName" value={formData.brideName} onChange={handleChange} placeholder="Ej. Debanhi" required className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Fecha y Hora del Evento</label>
                  <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-stone-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Frase de Bienvenida / Versículo</label>
                  <textarea name="welcomePhrase" rows="3" value={formData.welcomePhrase} onChange={handleChange} placeholder="Una dedicatoria que abrirá la invitación..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600" />
                </div>

                {/* 📸 COMPONENTE DE SUBIDA DE IMÁGENES INTEGRADO */}
                <div className="pt-2">
                  <ImageUploader 
                    folderSlug={tempSlug} 
                    onUploadComplete={(url) => setCoverImage(url)} 
                    label="Foto Principal del Banner Web"
                  />
                </div>
              </motion.div>
            )}

            {/* PESTAÑA 2: LOGÍSTICA */}
            {activeTab === 'logistica' && (
              <motion.div
                key="logistica" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                  <h3 className="font-serif text-stone-800 font-medium text-base">⛪ Ceremonia Religiosa</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] font-semibold text-stone-400 uppercase">Hora</label>
                      <input type="text" name="ceremoniaHora" value={formData.ceremoniaHora} onChange={handleChange} placeholder="17:00 HRS" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-semibold text-stone-400 uppercase">Lugar / Templo</label>
                      <input type="text" name="ceremoniaLugar" value={formData.ceremoniaLugar} onChange={handleChange} placeholder="Nombre de la Iglesia" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <input type="text" name="ceremoniaMapsUrl" value={formData.ceremoniaMapsUrl} onChange={handleChange} placeholder="Enlace de Google Maps de la Ceremonia" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                  <h3 className="font-serif text-stone-800 font-medium text-base">🥂 Recepción / Fiesta</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] font-semibold text-stone-400 uppercase">Hora</label>
                      <input type="text" name="recepcionHora" value={formData.recepcionHora} onChange={handleChange} placeholder="19:30 HRS" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-semibold text-stone-400 uppercase">Salón / Quinta</label>
                      <input type="text" name="recepcionLugar" value={formData.recepcionLugar} onChange={handleChange} placeholder="Nombre del Salón de Eventos" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <input type="text" name="recepcionMapsUrl" value={formData.recepcionMapsUrl} onChange={handleChange} placeholder="Enlace de Google Maps de la Recepción" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Código de Vestimenta</label>
                  <select name="codigoVestimenta" value={formData.codigoVestimenta} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none">
                    <option value="Formal / Gala">Formal / Gala</option>
                    <option value="Formal Playa / Guayabera">Formal Playa / Guayabera</option>
                    <option value="Cocktail">Cocktail</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* PESTAÑA 3: REGALOS */}
            {activeTab === 'regalos' && (
              <motion.div
                key="regalos" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                  <h3 className="font-serif text-stone-800 font-medium text-base">✉️ Transferencia (Lluvia de Sobres)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="banco" value={formData.banco} onChange={handleChange} placeholder="Banco (ej. BBVA)" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    <input type="text" name="titular" value={formData.titular} onChange={handleChange} placeholder="Nombre del Titular" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                  </div>
                  <input type="text" name="clabe" value={formData.clabe} onChange={handleChange} placeholder="CLABE Interbancaria (18 dígitos)" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm tracking-wider font-mono focus:outline-none" />
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                  <h3 className="font-serif text-stone-800 font-medium text-base">🛍️ Tiendas Online (Links de Mesas)</h3>
                  <input type="text" name="amazonUrl" value={formData.amazonUrl} onChange={handleChange} placeholder="Enlace a Mesa de Regalos de Amazon" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                  <input type="text" name="liverpoolUrl" value={formData.liverpoolUrl} onChange={handleChange} placeholder="Enlace a Mesa de Regalos de Liverpool" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Botón de Envío / Guardado Global */}
          <div className="pt-4 border-t border-stone-100 flex justify-end gap-4">
            <button
              type="submit"
              disabled={guardando}
              className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm transform hover:scale-102 disabled:bg-stone-400 cursor-pointer"
            >
              {guardando ? "Guardando Configuración..." : "🔒 Guardar y Activar Invitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}