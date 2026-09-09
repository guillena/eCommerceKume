import Link from 'next/link';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <div className="flex flex-col w-full pt-28 bg-surface-subtle min-h-screen">
      {/* Top Decorative Ambient Glow */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-b from-primary-container/30 via-secondary-container/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>
        
        {/* 1. HERO SECTION */}
        <section className="relative max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-3xl lg:pt-space-2xl lg:pb-space-4xl flex flex-col items-center text-center w-full">
          {/* Badge superior minimalista */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-primary-container/40 text-on-surface shadow-sm mb-space-lg transition-transform hover:scale-[1.01]">
            <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
            <span className="font-label-sm text-label-sm tracking-tight text-on-surface font-medium">Recursos digitales para acompañar, enseñar y fortalecer procesos de aprendizaje</span>
          </div>
          
          {/* Título principal */}
          <h1 className="font-display text-display-mobile md:text-display max-w-4xl text-on-surface tracking-tight font-bold">Materiales listos para usar en talleres, clases y acompañamientos</h1>
          
          {/* Bajada */}
          <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-3xl mt-space-md leading-relaxed">
            Descargá guías, talleres y actividades en PDF para trabajar aprendizaje, atención, emociones, hábitos de estudio y acompañamiento familiar.<br className="hidden sm:inline" /> Recursos prácticos para docentes, psicopedagogos, terapeutas y familias que necesitan intervenir con claridad, ahorrar tiempo y contar con materiales profesionales desde el primer momento.
          </p>
          
          {/* Sub-destacado */}
          <div className="mt-space-md px-space-md py-space-xs rounded-xl bg-surface-container-low text-on-surface">
            <p className="font-label-md text-label-md font-semibold text-primary">Comprá, descargá y usalo cuando lo necesites.</p>
          </div>
          
          {/* Botones de acción principales */}
          <div className="mt-space-xl flex flex-col sm:flex-row items-center gap-space-sm w-full sm:w-auto">
            <Link className="w-full sm:w-auto px-space-lg py-3.5 rounded-xl bg-on-surface text-on-primary font-label-md text-label-md font-medium hover:bg-inverse-surface transition-all flex items-center justify-center gap-space-xs shadow-sm hover:-translate-y-0.5" href="/productos">
              <span>Ver materiales disponibles</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          
          {/* Elementos de confianza */}
          <div className="mt-space-2xl grid grid-cols-1 sm:grid-cols-3 gap-space-sm sm:gap-space-lg max-w-2xl w-full pt-space-lg border-t-0">
            <div className="flex items-center justify-center gap-space-xs py-space-xs px-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">Descarga inmediata en PDF</span>
            </div>
            <div className="flex items-center justify-center gap-space-xs py-space-xs px-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-[20px]">spa</span>
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">Basado en la práctica real</span>
            </div>
            <div className="flex items-center justify-center gap-space-xs py-space-xs px-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[20px]">lock</span>
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">Pago 100% seguro</span>
            </div>
          </div>
        </section>
      </div>
      
      {/* 2. PROPUESTA DE VALOR / GANCHO DESTACADO */}
      <section className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl w-full">
        <div className="w-full bg-pastel-cream/35 rounded-2xl p-space-lg lg:p-space-2xl shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-pastel-cream/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center mb-space-md shadow-sm text-on-surface">
              <span className="material-symbols-outlined text-[28px]">psychology_alt</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold tracking-tight">
              Aprender, acompañar y enseñar con mejores herramientas
            </h2>
            <p className="font-body-md text-body-md md:text-body-lg text-on-surface-variant mt-space-md leading-relaxed">
              Muchas veces sabemos qué queremos trabajar, pero no tenemos el tiempo para armar el material desde cero. Por eso en Kume desarrollamos recursos descargables que te permiten pasar rápidamente de la idea a la acción. Cada PDF está pensado para que puedas aplicarlo en talleres, sesiones, clases, encuentros con familias o espacios de acompañamiento individual.
            </p>
            <div className="mt-space-lg w-full bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm flex items-start sm:items-center gap-space-md text-left">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-on-surface">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              </div>
              <p className="font-label-md text-label-md md:text-body-md text-on-surface font-medium leading-normal">
                No empieces cada taller desde cero. Descargá materiales profesionales, claros y listos para usar en tus espacios de aprendizaje y acompañamiento.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 4. SHOWCASE DE PRODUCTOS DESTACADOS */}
      <section className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
        <div className="bg-surface-container-lowest rounded-3xl p-space-lg lg:p-space-2xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl">
            <div>
              <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">Tienda de recursos</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold mt-space-2xs">
                Materiales más descargados
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-space-2xs bg-surface-container-low p-1.5 rounded-xl">
              <Link href="/productos" className="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-semibold shadow-sm transition-all">Ver todos los productos</Link>
            </div>
          </div>
          
          <FeaturedProducts />
        </div>
      </section>


      {/* 5. SECCI�N ¿POR QU�0 ELEGIR LOS MATERIALES DE KUME? */}
      <section className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl w-full">
        <div className="text-center max-w-3xl mx-auto mb-space-2xl">
          <span className="font-label-sm text-label-sm text-primary uppercase font-semibold tracking-wider">Criterio pedagógico</span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold mt-space-2xs">
            ¿Por qué elegir los materiales de Kume?
          </h2>
          <p className="font-body-md text-body-md md:text-body-lg text-on-surface-variant mt-space-sm leading-relaxed">
            Porque están pensados desde la práctica real. No son documentos teóricos extensos ni materiales genéricos difíciles de aplicar. Son recursos concretos, ordenados y diseñados para que puedas usarlos sin perder tiempo.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md lg:gap-space-lg">
          {/* Beneficio 1 */}
          <div className="bg-pastel-cream rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface mb-space-md">
              <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Preparar talleres con mayor facilidad</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Estructuras prearmadas con secuencias claras, tiempos sugeridos y preguntas disparadoras para conducir con fluidez.
            </p>
          </div>
          {/* Beneficio 2 */}
          <div className="bg-pastel-cream rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface mb-space-md">
              <span className="material-symbols-outlined text-[24px]">dashboard_customize</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Actividades claras y estructuradas</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Instrucciones sin rodeos, listas para que el alumno o paciente las comprenda de manera intuitiva y motivadora.
            </p>
          </div>
          {/* Beneficio 3 */}
          <div className="bg-pastel-cream rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface mb-space-md">
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Acompañamiento más organizado</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Fichas de registro y seguimiento que permiten objetivar progresos y detectar desafíos en cada etapa evolutiva.
            </p>
          </div>
          {/* Beneficio 4 */}
          <div className="bg-pastel-cream rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface mb-space-md">
              <span className="material-symbols-outlined text-[24px]">groups_3</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Trabajo efectivo con familias y grupos</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Materiales que crean puentes colaborativos entre consultorio, escuela y hogar, unificando pautas con calidez.
            </p>
          </div>
          {/* Beneficio 5 */}
          <div className="bg-pastel-cream rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface mb-space-md">
              <span className="material-symbols-outlined text-[24px]">schedule</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Ahorro real en planificación y diseño</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Olvidate de pasar horas diseñando hojas de trabajo en Canva o Word. Todo listo con calidad editorial superior.
            </p>
          </div>
          {/* Beneficio 6 */}
          <div className="bg-pastel-cream rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface mb-space-md">
              <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Descarga inmediata y reutilización</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
              Recibís el enlace al instante. El archivo te pertenece para siempre e imprimís la cantidad de copias que precises.
            </p>
          </div>
        </div>
      </section>

      {/* 6. PROCESO DE COMPRA SIMPLE */}
      <section className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
        <div className="bg-surface-subtle rounded-3xl p-space-lg lg:p-space-2xl shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-space-2xl">
            <span className="font-label-sm text-label-sm text-primary uppercase font-semibold tracking-wider">Flujo simple y ágil</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold mt-space-2xs">
              Materiales digitales, descarga inmediata
            </h2>
            <p className="font-body-md text-body-md md:text-body-lg text-on-surface-variant mt-space-sm leading-relaxed">
              Comprás el recurso, lo descargás en PDF y podés empezar a usarlo. Sin esperas. Sin envíos. Sin complicaciones. Elegí el material que necesitás, descargalo y aplicalo en tu próximo encuentro, clase, sesión o taller.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
            {/* Paso 1 */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm relative flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-pastel-cream text-on-surface font-headline-sm font-bold flex items-center justify-center mb-space-md">1</div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">Elegí tu recurso</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Revisá la descripción detallada, objetivos pedagógicos, índice de contenidos y vistas previas de cada documento.
              </p>
              <div className="mt-space-md inline-flex items-center gap-1 text-primary font-caption text-caption font-semibold">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Previsualización disponible
              </div>
            </div>
            {/* Paso 2 */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm relative flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-fixed font-headline-sm font-bold flex items-center justify-center mb-space-md">2</div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">Pago seguro online</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Aboná con tarjeta de débito, crédito o transferencia bancaria a través de pasarelas encriptadas y certificadas.
              </p>
              <div className="mt-space-md inline-flex items-center gap-1 text-secondary font-caption text-caption font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Transacción encriptada SSL
              </div>
            </div>
            {/* Paso 3 */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm relative flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-pastel-mint text-on-surface font-headline-sm font-bold flex items-center justify-center mb-space-md">3</div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">Descarga inmediata en PDF</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Acceso instantáneo en pantalla, copia automática enviada a tu email y archivo disponible en tu cuenta para siempre.
              </p>
              <div className="mt-space-md inline-flex items-center gap-1 text-on-tertiary-container font-caption text-caption font-semibold">
                <span className="material-symbols-outlined text-[16px]">folder_zip</span>
                Formato universal de alta calidad
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECCI�N PARA QUI�0NES SON ESTOS RECURSOS */}
      <section className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl w-full">
        <div className="text-center max-w-3xl mx-auto mb-space-xl">
          <span className="font-label-sm text-label-sm text-primary uppercase font-semibold tracking-wider">Comunidad Kume</span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold mt-space-2xs">
            ¿Para quiénes son estos recursos?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
            Diseñados para toda la comunidad que acompaña el desarrollo integral
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-space-sm max-w-5xl mx-auto">
          <div className="flex items-center gap-space-xs px-space-md py-space-sm rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <span className="font-label-md text-label-md font-semibold text-on-surface">Psicopedagogos y psicopedagogas</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-sm rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </div>
            <span className="font-label-md text-label-md font-semibold text-on-surface">Docentes y directivos escolares</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-sm rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-full bg-pastel-mint flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined text-[18px]">group_work</span>
            </div>
            <span className="font-label-md text-label-md font-semibold text-on-surface">Equipos de orientación escolar (EOE)</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-sm rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-full bg-pastel-cream flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </div>
            <span className="font-label-md text-label-md font-semibold text-on-surface">Terapeutas y profesionales del desarrollo infantil</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-sm rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined text-[18px]">cottage</span>
            </div>
            <span className="font-label-md text-label-md font-semibold text-on-surface">Familias que quieren acompañar mejor el aprendizaje</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-sm rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
            <span className="font-label-md text-label-md font-semibold text-on-surface">Instituciones educativas</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-space-sm rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">co_present</span>
            </div>
            <span className="font-label-md text-label-md font-semibold text-on-surface">Coordinadores de talleres y espacios de formación</span>
          </div>
        </div>
      </section>

      {/* 8. BANNER FINAL DE LLAMADO A LA ACCI�N (CTA) */}
      <section className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-4xl w-full">
        <div className="w-full bg-blue-pastel rounded-3xl p-space-xl lg:p-space-3xl shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm mb-space-md">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span>Herramientas con valor clínico y docente</span>
          </div>
          <h2 className="font-display text-display-mobile md:text-headline-lg max-w-3xl text-on-surface font-bold tracking-tight">
            Transformá una necesidad en una intervención concreta
          </h2>
          <p className="font-body-md text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mt-space-md leading-relaxed">
            Cuando un niño, adolescente, familia o grupo necesita acompañamiento, contar con una buena herramienta puede marcar la diferencia. En Kume te ofrecemos recursos simples, profesionales y aplicables para que puedas intervenir con mayor seguridad.
          </p>
          <p className="font-label-md text-label-md font-semibold text-on-surface mt-space-md">
            Explorá nuestros materiales y elegí el recurso que mejor se adapte a lo que necesitás trabajar.
          </p>
          
          <div className="mt-space-xl flex flex-col sm:flex-row items-center gap-space-sm w-full sm:w-auto">
            <Link className="w-full sm:w-auto px-space-xl py-3.5 rounded-xl bg-on-surface text-on-primary font-label-md text-label-md font-medium hover:bg-inverse-surface transition-all flex items-center justify-center gap-space-xs shadow-sm hover:-translate-y-0.5" href="/productos">
              <span>Ver materiales disponibles</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
