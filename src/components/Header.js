export function renderHeader() {
  return `
    <header class="text-center py-8 mb-6">
      <h1 class="font-cinzel text-4xl md:text-5xl font-bold text-stone-800 tracking-wide">
        Ancient Number Converter
      </h1>
      <p class="font-crimson text-lg md:text-xl text-stone-600 mt-2 italic">
        Explore how civilizations counted across millennia
      </p>
    </header>`;
}

export function renderSticker() {
  return `
    <a href="volume.html"
       class="fixed top-4 right-4 z-40 print:hidden animate-stickerBounce">
      <div class="bg-jungle text-parchment-light font-cinzel
                  px-4 py-3 rounded-full shadow-lg hover:shadow-xl
                  hover:scale-105 transition-all duration-200
                  border-2 border-amber/50"
           style="transform: rotate(-12deg);">
        <div class="text-[10px] uppercase tracking-widest text-amber font-bold">New!</div>
        <div class="text-sm leading-tight mt-0.5">Mayan<br>Volume</div>
      </div>
    </a>`;
}
