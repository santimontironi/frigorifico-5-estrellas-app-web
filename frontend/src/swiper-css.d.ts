// Declaraciones para los imports de CSS de Swiper (side-effect imports).
// Swiper no incluye tipos para estos subpaths de estilos, y con
// verbatimModuleSyntax + moduleResolution "bundler" tsc los rechaza (TS2882).
declare module 'swiper/css'
declare module 'swiper/css/pagination'
declare module 'swiper/css/navigation'
declare module 'swiper/css/autoplay'
