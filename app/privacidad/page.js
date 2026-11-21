import PaginaLegal from '@/components/PaginaLegal';

export const metadata = {
  title: 'Aviso de privacidad | ClickyPapel',
  description: 'Cómo ClickyPapel trata tus datos personales y los de tus invitados.',
};

/*
  ⚠️ ANTES DE PUBLICAR: reemplaza todo lo que está entre [CORCHETES].
  Son los mismos datos que faltan en /terminos: responsable, correo,
  WhatsApp y ciudad. Sin ellos, el aviso no está completo.
*/

const RESPONSABLE = '[RAZÓN SOCIAL O TU NOMBRE COMPLETO]';
const CORREO = '[CORREO@CLICKYPAPEL.COM]';
const WHATSAPP = '[TU NÚMERO DE WHATSAPP]';
const CIUDAD = '[CIUDAD], [ESTADO]';

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Aviso de privacidad"
      actualizado="noviembre de 2026"
      intro="Este aviso explica qué datos personales recoge ClickyPapel, para qué los usa y qué derechos tienes sobre ellos. Está escrito para que se entienda sin abogado."
      secciones={[
        {
          titulo: 'Quién trata tus datos',
          parrafos: [
            `El responsable del tratamiento de tus datos personales es ${RESPONSABLE}, operador del servicio ClickyPapel, con domicilio en ${CIUDAD}.`,
            `Si tienes dudas sobre este aviso o sobre tus datos, escríbenos a ${CORREO} o por WhatsApp al ${WHATSAPP}.`,
          ],
        },
        {
          titulo: 'Qué datos recogemos',
          parrafos: [
            'Para crear tu cuenta: tu nombre y tu correo electrónico (o los datos de tu cuenta de Google si entras con Google).',
            'Para tu invitación: los nombres de los novios o festejados, la fecha y los detalles del evento, las fotografías y la música que subas, y los datos que tú decidas publicar (lugares, horarios, mesas de regalos y datos bancarios para recibir regalos).',
            'De tus invitados: los nombres y el número de pases que tú registres, y sus respuestas de confirmación de asistencia (RSVP).',
            'De uso: datos técnicos necesarios para que el servicio funcione, como la dirección IP y el tipo de dispositivo con el que nos visitas.',
          ],
        },
        {
          titulo: 'Para qué usamos tus datos',
          parrafos: [
            'Para crear y mostrar tu invitación digital en su dirección web propia.',
            'Para que tus invitados puedan confirmar su asistencia y para que tú lleves el control de tu lista.',
            'Para procesar tu pago a través de Stripe y para darte soporte cuando nos escribas.',
            'No vendemos tus datos personales ni los de tus invitados. No los usamos para publicidad de terceros.',
          ],
        },
        {
          titulo: 'Con quién se comparten',
          parrafos: [
            'Tus datos se guardan y se procesan con nuestros proveedores de servicio: Supabase (base de datos y archivos) y Stripe (pagos). Solo reciben lo necesario para su función y no pueden usarlos para otra cosa.',
            'Tu invitación es pública por diseño: quien tenga su enlace puede verla, tal como tú la configuraste. Lo que no quieras mostrar, no lo subas.',
            'Solo compartimos datos con autoridades cuando la ley mexicana nos lo exige.',
          ],
        },
        {
          titulo: 'Cuánto tiempo los guardamos',
          parrafos: [
            'Tus datos se conservan mientras tu cuenta y tu invitación estén activas, y hasta [NÚMERO] meses después de la fecha de tu evento, como se indica en los Términos y condiciones.',
            'Cuando se da de baja tu invitación, eliminamos sus datos personales. Los comprobantes de pago se conservan el tiempo que exijan las obligaciones fiscales.',
          ],
        },
        {
          titulo: 'Tus derechos ARCO',
          parrafos: [
            'Tienes derecho a acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO, Ley Federal de Protección de Datos Personales en Posesión de los Particulares).',
            `Para ejercerlos, escríbenos a ${CORREO} indicando tu nombre, tu cuenta y qué quieres hacer con tus datos. Te respondemos en un máximo de 20 días hábiles, como marca la ley.`,
            'También puedes pedirnos que eliminemos tu cuenta y tu invitación en cualquier momento.',
          ],
        },
        {
          titulo: 'Datos de menores',
          parrafos: [
            'El servicio lo contrata un adulto. Si tu invitación incluye fotografías de menores, nos confirmas que tienes el permiso de sus padres o tutores para publicarlas.',
          ],
        },
        {
          titulo: 'Seguridad',
          parrafos: [
            'Protegemos tus datos con las medidas de seguridad de nuestros proveedores (Supabase y Stripe) y con acceso restringido por cuenta y contraseña.',
            'Ningún sistema es infalible: si detectas un acceso que no reconoces, avísanos de inmediato.',
          ],
        },
        {
          titulo: 'Cambios a este aviso',
          parrafos: [
            'Si lo modificamos, publicamos la versión nueva aquí con su fecha. Si el cambio es importante, te avisamos por correo.',
          ],
        },
        {
          titulo: 'Contacto',
          parrafos: [
            `Cualquier duda sobre este aviso o tus datos: ${CORREO} o WhatsApp al ${WHATSAPP}.`,
          ],
        },
      ]}
    />
  );
}
