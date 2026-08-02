import PaginaLegal from '@/components/PaginaLegal';

export const metadata = {
  title: 'Términos y condiciones | ClickyPapel',
  description: 'Las reglas del servicio de invitaciones digitales ClickyPapel.',
};

/*
  ⚠️ ANTES DE PUBLICAR: reemplaza todo lo que está entre [CORCHETES].
  Presta atención especial a los plazos de reembolso y de vigencia:
  son decisiones de negocio que solo tú puedes tomar.
*/

const RESPONSABLE = '[RAZÓN SOCIAL O TU NOMBRE COMPLETO]';
const CORREO = '[CORREO@CLICKYPAPEL.COM]';
const WHATSAPP = '[TU NÚMERO DE WHATSAPP]';
const CIUDAD = '[CIUDAD], [ESTADO]';

export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Términos y condiciones"
      actualizado="agosto de 2026"
      intro="Estas son las reglas de ClickyPapel. Están escritas para que se entiendan sin abogado. Al crear una invitación aceptas lo que dice aquí."
      secciones={[
        {
          titulo: 'Qué es ClickyPapel',
          parrafos: [
            `ClickyPapel es un servicio operado por ${RESPONSABLE} que te permite crear invitaciones digitales para bodas, XV años, baby showers, bautizos y despedidas.`,
            'Tu invitación vive en una dirección web propia que compartes con tus invitados. Incluye herramientas para que confirmen su asistencia y para que tú lleves el control de tu lista.',
          ],
        },
        {
          titulo: 'Crear gratis, pagar para publicar',
          parrafos: [
            'Puedes armar tu invitación completa sin pagar nada y verla funcionando tal como quedará.',
            'Mientras no la publiques, la invitación se muestra marcada como vista previa y no está pensada para compartirse. Al pagar, esa marca desaparece y el enlace queda listo para tus invitados.',
          ],
        },
        {
          titulo: 'Tu cuenta',
          parrafos: [
            'Necesitas una cuenta para guardar tu invitación. Puedes crearla con tu correo o entrando con Google.',
            'Eres responsable de lo que ocurra desde tu cuenta y de mantener segura tu contraseña. Si detectas un acceso que no reconoces, avísanos de inmediato.',
            'Una cuenta pertenece a una persona. No la compartas ni la revendas.',
          ],
        },
        {
          titulo: 'Precios y pagos',
          parrafos: [
            'Los precios están en pesos mexicanos e incluyen IVA. Son un solo pago por evento: no hay mensualidades ni cargos recurrentes.',
            'El cobro lo procesa Stripe. Aceptamos las tarjetas y métodos que Stripe habilite en México.',
            'Podemos cambiar los precios cuando queramos, pero nunca de forma retroactiva: lo que ya pagaste se respeta.',
            `Si necesitas factura, escríbenos a ${CORREO} dentro del mes en que hiciste el pago.`,
          ],
        },
        {
          titulo: 'Reembolsos',
          parrafos: [
            'Puedes pedir la devolución completa dentro de los [NÚMERO] días naturales siguientes a tu pago, siempre que no hayas compartido el enlace con tus invitados.',
            'Una vez que compartiste la invitación, el servicio ya se prestó y no hay reembolso. Por eso te dejamos armarla y verla completa antes de cobrarte: para que decidas con todo a la vista.',
            'Si algo de nuestro lado falla y no podemos repararlo, te devolvemos tu dinero aunque ya la hayas compartido.',
            `Para solicitar un reembolso escríbenos a ${CORREO} o por WhatsApp al ${WHATSAPP}.`,
          ],
        },
        {
          titulo: 'El contenido que subes es tuyo',
          parrafos: [
            'Las fotografías, textos y música que subas siguen siendo tuyos. Nosotros solo obtenemos el permiso necesario para guardarlos y mostrarlos dentro de tu invitación.',
            'Al subirlos nos confirmas que tienes derecho a usarlos: que las fotos son tuyas o tienes permiso del fotógrafo, y que las personas que aparecen están de acuerdo.',
            'Si subes música propia, tú respondes por sus derechos de autor. La música que te ofrecemos dentro de la plataforma sí está licenciada para este uso.',
          ],
        },
        {
          titulo: 'Lo que no se vale',
          parrafos: ['Tu invitación no puede usarse para:'],
          lista: [
            'Contenido ilegal, violento, discriminatorio o sexual.',
            'Suplantar a otra persona o hacer pasar tu evento por uno que no es.',
            'Recaudar dinero con engaños o para fines distintos a tu celebración.',
            'Subir material del que no tengas derechos.',
            'Intentar vulnerar la plataforma o acceder a datos de otros usuarios.',
          ],
        },
        {
          titulo: 'Suspensión',
          parrafos: [
            'Si detectamos un uso que rompe estas reglas, podemos suspender la invitación o la cuenta.',
            'Cuando se pueda, te avisamos primero y te damos oportunidad de corregir. En casos graves o ilegales, la suspensión es inmediata y sin reembolso.',
          ],
        },
        {
          titulo: 'Cuánto dura tu invitación',
          parrafos: [
            'Tu invitación permanece en línea hasta [NÚMERO] meses después de la fecha de tu evento.',
            'Antes de darla de baja te avisamos por correo para que descargues lo que quieras conservar. Si te interesa mantenerla más tiempo, se puede acordar.',
          ],
        },
        {
          titulo: 'El servicio se presta como está',
          parrafos: [
            'Trabajamos para que ClickyPapel esté siempre disponible, pero no podemos garantizar cero interrupciones: dependemos de proveedores externos y de internet.',
            'Podemos hacer mantenimientos programados. Cuando afecten el servicio, avisamos con anticipación.',
            'Te recomendamos guardar por tu cuenta una copia de tus fotografías y de tu lista de invitados.',
          ],
        },
        {
          titulo: 'Hasta dónde respondemos',
          parrafos: [
            'Si algo sale mal por causa nuestra, nuestra responsabilidad máxima es devolverte lo que pagaste por ese evento.',
            'No respondemos por daños indirectos: invitados que no llegaron, gastos de tu fiesta o pérdidas de oportunidad.',
            'Nada de esto limita los derechos que la ley mexicana te reconoce como consumidor.',
          ],
        },
        {
          titulo: 'Cambios a estos términos',
          parrafos: [
            'Si los modificamos, publicamos la versión nueva aquí con su fecha. Si el cambio es importante, te avisamos por correo.',
            'Los cambios aplican hacia adelante. Las condiciones de una invitación que ya pagaste no se alteran.',
          ],
        },
        {
          titulo: 'Ley aplicable',
          parrafos: [
            `Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se resolverá ante los tribunales de ${CIUDAD}.`,
            'Como consumidor, también puedes acudir a la Procuraduría Federal del Consumidor (PROFECO).',
          ],
        },
        {
          titulo: 'Contacto',
          parrafos: [
            `Cualquier duda sobre estos términos: ${CORREO} o WhatsApp al ${WHATSAPP}.`,
          ],
        },
      ]}
    />
  );
}
