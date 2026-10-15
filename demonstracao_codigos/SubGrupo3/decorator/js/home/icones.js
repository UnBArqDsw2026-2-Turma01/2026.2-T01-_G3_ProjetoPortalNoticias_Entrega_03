const caminhos = {
    inicio: '<path d="m3 10 9-7 9 7v10H6V10"/><path d="M10 20v-7h4v7"/>',
    explorar: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5z"/>',
    salvo: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4z"/>',
    mais: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
    busca: '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/>',
    seta: '<path d="m9 5 7 7-7 7"/>',
    alta: '<path d="M3 21v-6m6 6V11m6 10v-7m6 7V6M2 10l7-6 5 5 7-7m-5 0h5v5"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18m-14 4h1m3 0h1m3 0h1m-9 3h1m3 0h1"/>',
    local: '<path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    sino: '<path d="M5 16h14l-2-3V8A5 5 0 0 0 7 8v5ZM10 19a2 2 0 0 0 4 0"/>',
    acesso: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="6" r="2"/><path d="m5 10 7 2 7-2m-7 2v4m0-1-4 5m4-5 4 5"/>',
    esporte: '<ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)"/><path d="m8 8 8 8m-6-7-2 2m5-1-2 2m5-1-2 2"/>',
    cultura: '<path d="M5 4 4 14q4 8 9 1l-1-10zM14 3l7 3-2 10q-2 5-5 1M7 8h1m2 1h1M7 12q2 2 3 0m6-5h1m1 2h1"/>',
    politica: '<path d="m3 8 9-6 9 6ZM3 21h18M5 10v8m5-8v8m4-8v8m5-8v8M2 19h20"/>',
    tecnologia: '<rect x="3" y="4" width="18" height="13"/><path d="M12 17v4m-5 0h10"/>',
};
export function icone(nome) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${caminhos[nome]}</svg>`;
}
