// Ponto de entrada principal do jogo

// Variável global para acesso ao jogo
window.game = null;

// Inicializa o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    console.log('=== RPG 2D Top-Down ===');
    console.log('Inicializando...');
    
    // Cria e inicia o jogo
    window.game = new Game();
    window.game.start();
    
    console.log('Jogo pronto para jogar!');
    console.log('Use WASD para mover, Shift para correr, Espaço para atacar, I para inventário');
    
    // Log do sistema de observadores
    console.log('Sistema Observer Pattern ativo no ciclo dia/noite');
    console.log('O jogador reagirá automaticamente às mudanças de período do dia');
});

// Previne comportamento padrão de algumas teclas
window.addEventListener('keydown', (e) => {
    // Previne espaço de rolar a página
    if (e.key === ' ') {
        e.preventDefault();
    }
    
    // Previne comportamento padrão de teclas de seta
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

// Redimensiona o canvas se a janela for redimensionada
window.addEventListener('resize', () => {
    if (window.game) {
        window.game.setupCanvas();
    }
});
