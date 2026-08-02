import PaginaLegal from '@/components/PaginaLegal';

export const metadata = {
  title: 'Aviso de privacidad | ClickyPapel',
  description: 'Cómo ClickyPapel recaba, usa y protege tus datos personales.',
};

/*
  ⚠️ ANTES DE PUBLICAR: reemplaza todo lo que está entre [CORCHETES].
  Son los datos que la ley exige y que solo tú tienes.
*/

const RESPONSABLE = '[RAZÓN SOCIAL O TU NOMBRE COMPLETO]';
const DOMICILIO = '[CALLE, NÚMERO, COLONIA, C.P., CIUDAD, ESTADO]';
const CORREO = '[CORREO@CLICKYPAPEL.COM]';
const WHATSAPP = '[TU NÚMERO DE WHATSAPP]';

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Aviso de privacidad"
      actualizado="agosto de 2026"
      intro={`En ClickyPapel manejamos datos de dos tipos de personas: quien crea la invitación y quien la recibe. Este aviso explica qué guardamos de cada quien, para qué, y cómo puedes pedirnos que lo borremos. Está redactado conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.`}
      secciones={[
        {
          titulo: 'Quién es responsable de tus datos',
          parrafos: [
            `${RESPONSABLE}, con domicilio en ${DOMICILIO}, es responsable del tratamiento de tus datos personales.`,
            `Para cualquier tema de privacidad puedes escribirnos a ${CORREO} o por WhatsApp al ${WHATSAPP}.`,
          ],
        },
        {
          titulo: 'Qué datos recabamos',
          parrafos: ['Depende de cómo uses ClickyPapel.'],
          lista: [
            'Si creas una invitación: tu nombre, correo electrónico y, si entras con Google, la foto de perfil asociada a esa cuenta.',
            'Sobre tu evento: nombres de los festejados, fecha, lugares, horarios, fotografías que subas, y los datos bancarios o enlaces de mesa de regalos que decidas mostrar a tus invitados.',
            'Tu lista de invitados: los nombres y número de pases que tú captures.',
            'Si eres invitado: tu nombre tal como aparece en la lista y tu respuesta de asistencia.',
            'Datos técnicos: dirección IP, tipo de navegador y páginas visitadas, para que el servicio funcione y podamos detectar fallas.',
          ],
        },
        {
          titulo: 'Datos de pago',
          parrafos: [
            'Los cobros los procesa Stripe. Los datos de tu tarjeta viajan directamente a Stripe y nunca pasan por nuestros servidores: nosotros no los vemos, no los guardamos y no tenemos forma de recuperarlos.',
            'De cada compra conservamos únicamente el plan contratado, el monto, la fecha y un identificador de la transacción, para efectos de facturación y aclaraciones.',
          ],
        },
        {
          titulo: 'Para qué usamos tus datos',
          parrafos: ['Estas son las finalidades necesarias para prestarte el servicio:'],
          lista: [
            'Crear y mostrar tu invitación en la dirección que elegiste.',
            'Registrar y mostrarte las confirmaciones de tus invitados.',
            'Darte acceso a tu panel y permitirte editar tu evento.',
            'Procesar tu pago y desbloquear la publicación.',
            'Contactarte por temas relacionados con tu invitación o tu cuenta.',
          ],
        },
        {
          titulo: 'Finalidades que puedes rechazar',
          parrafos: [
            'Adicionalmente nos gustaría usar tu correo para enviarte novedades, promociones y recordatorios. Esto no es necesario para prestarte el servicio.',
            `Si no quieres recibirlos, escríbenos a ${CORREO} y te sacamos de la lista. También puedes darte de baja desde cualquier correo que te mandemos. Negarte no afecta en nada tu invitación ni tu cuenta.`,
          ],
        },
        {
          titulo: 'Con quién compartimos tus datos',
          parrafos: [
            'No vendemos tus datos a nadie. Los compartimos únicamente con los proveedores que hacen funcionar la plataforma:',
          ],
          lista: [
            'Supabase — guarda la base de datos y las fotografías que subes.',
            'Vercel — aloja el sitio y entrega las páginas a tus visitantes.',
            'Stripe — procesa los pagos.',
            'Google — únicamente si eliges entrar con tu cuenta de Google.',
            'Autoridades competentes, cuando exista una orden fundada y motivada.',
          ],
        },
        {
          titulo: 'Tu invitación es pública',
          parrafos: [
            'Esto es importante que lo tengas claro: cuando publicas tu invitación, cualquiera que tenga el enlace puede verla. No pide contraseña, porque justamente la idea es que puedas compartirla libremente por WhatsApp.',
            'Eso incluye todo lo que hayas puesto ahí: nombres, fecha, ubicaciones, fotografías y, si los capturaste, tus datos bancarios o CLABE. Piensa dos veces antes de incluir información que no quieras que circule.',
            'Tu lista de invitados y sus confirmaciones no son públicas: solo se ven desde tu panel.',
          ],
        },
        {
          titulo: 'Los datos de tus invitados',
          parrafos: [
            'Cuando capturas la lista de invitados, tú estás compartiendo datos de otras personas. Al hacerlo confirmas que tienes su consentimiento para usarlos con este fin.',
            'Nosotros tratamos esos datos únicamente para mostrar la invitación y registrar las confirmaciones. No los usamos para nada más, ni les enviamos publicidad.',
          ],
        },
        {
          titulo: 'Cuánto tiempo los conservamos',
          parrafos: [
            'Tu invitación y su información permanecen activas mientras tu cuenta exista, y hasta [NÚMERO] meses después de la fecha de tu evento.',
            'Pasado ese plazo podemos eliminar el contenido para liberar espacio. Si quieres conservarlo más tiempo, avísanos antes.',
          ],
        },
        {
          titulo: 'Tus derechos ARCO',
          parrafos: [
            'La ley te da cuatro derechos sobre tus datos: acceder a ellos, rectificarlos si están mal, cancelarlos cuando ya no los necesitemos, y oponerte a que los usemos para ciertos fines.',
            `Para ejercerlos, escríbenos a ${CORREO} desde el correo con el que te registraste, dinos cuál derecho quieres ejercer y sobre qué datos. Te respondemos en un máximo de 20 días hábiles.`,
            'También puedes revocar tu consentimiento en cualquier momento. Ten en cuenta que si lo revocas, no podremos seguir mostrando tu invitación.',
          ],
        },
        {
          titulo: 'Cookies',
          parrafos: [
            'Usamos almacenamiento local del navegador para mantener tu sesión abierta y para guardar el borrador de tu invitación mientras la creas. Sin esto tendrías que volver a entrar en cada página.',
            'No usamos cookies de publicidad ni de seguimiento entre sitios. Puedes borrarlas desde la configuración de tu navegador, aunque perderías la sesión.',
          ],
        },
        {
          titulo: 'Menores de edad',
          parrafos: [
            'ClickyPapel está dirigido a mayores de 18 años. Si el evento es de una persona menor de edad —unos XV años, un bautizo, un baby shower— la cuenta debe crearla y administrarla su padre, madre o tutor.',
          ],
        },
        {
          titulo: 'Seguridad',
          parrafos: [
            'Aplicamos medidas técnicas para proteger tu información: conexión cifrada, contraseñas resguardadas por nuestro proveedor de autenticación, y reglas que impiden que un usuario acceda a los datos de otro.',
            'Aun así, ningún sistema es infalible. Si llegara a ocurrir una vulneración que afecte tus datos, te lo notificaríamos.',
          ],
        },
        {
          titulo: 'Cambios a este aviso',
          parrafos: [
            'Si modificamos este aviso, publicaremos la versión nueva en esta misma página con su fecha de actualización. Si el cambio es importante, te avisamos por correo.',
          ],
        },
      ]}
    />
  );
}
