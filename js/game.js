// Motor Principal do Jogo

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configura o canvas
        this.setupCanvas();
        
        // Estado do jogo
        this.isRunning = false;
        this.lastTime = 0;
        
        // Sistemas
        this.dayNightCycle = new DayNightCycle();
        this.inventory = new Inventory();
        
        // Jogador
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        
        // Registra o jogador como observador do ciclo dia/noite
        this.dayNightCycle.addObserver(this.player);
        
        // Velocidade rápida do ciclo para demonstração (pode ajustar)
        this.dayNightCycle.setCycleSpeed(10); // 10x mais rápido
        
        // Mundo/Mapa
        this.world = {
            trees: this.generateTrees(15),
            rocks: this.generateRocks(10)
        };
        
        // Controles
        this.setupControls();
        
        console.log('Jogo inicializado!');
    }

    setupCanvas() {
        // Define tamanho do canvas baseado no container
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        console.log(`Canvas configurado: ${this.canvas.width}x${this.canvas.height}`);
    }

    generateTrees(count) {
        const trees = [];
        for (let i = 0; i < count; i++) {
            trees.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 20 + Math.random() * 20
            });
        }
        return trees;
    }

    generateRocks(count) {
        const rocks = [];
        for (let i = 0; i < count; i++) {
            rocks.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 15 + Math.random() * 15
            });
        }
        return rocks;
    }

    setupControls() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });

        // Controles de UI
        const closeInventoryBtn = document.getElementById('close-inventory');
        if (closeInventoryBtn) {
            closeInventoryBtn.addEventListener('click', () => {
                this.inventory.toggle();
            });
        }
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        
        // Movimento
        if (key === 'w') this.player.keys.w = true;
        if (key === 'a') this.player.keys.a = true;
        if (key === 's') this.player.keys.s = true;
        if (key === 'd') this.player.keys.d = true;
        if (key === 'shift') this.player.keys.shift = true;
        
        // Ações
        if (key === ' ') {
            e.preventDefault();
            this.player.attack();
        }
        
        if (key === 'i') {
            e.preventDefault();
            this.inventory.toggle();
        }
        
        if (key === 'e') {
            e.preventDefault();
            this.useNearestItem();
        }
    }

    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        
        if (key === 'w') this.player.keys.w = false;
        if (key === 'a') this.player.keys.a = false;
        if (key === 's') this.player.keys.s = false;
        if (key === 'd') this.player.keys.d = false;
        if (key === 'shift') this.player.keys.shift = false;
    }

    useNearestItem() {
        // Exemplo de interação com item do mundo
        console.log('Tentando usar item próximo...');
        // Aqui poderia adicionar lógica para interagir com objetos no mundo
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.dayNightCycle.start();
            this.lastTime = performance.now();
            this.gameLoop();
            console.log('Jogo iniciado!');
        }
    }

    stop() {
        this.isRunning = false;
        this.dayNightCycle.stop();
        console.log('Jogo pausado!');
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calcula delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Atualiza
        this.update(deltaTime);
        
        // Renderiza
        this.render();
        
        // Próximo frame
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Atualiza o jogador
        this.player.update(deltaTime);
        
        // Aqui poderia atualizar inimigos, NPCs, etc.
    }

    render() {
        // Limpa o canvas
        this.ctx.fillStyle = this.getBackgroundColor();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenha o mundo
        this.drawWorld();
        
        // Desenha o jogador
        this.player.draw(this.ctx);
        
        // Desenha efeitos de overlay (dia/noite)
        this.drawDayNightOverlay();
    }

    getBackgroundColor() {
        // Cor de fundo baseada no período do dia
        switch (this.dayNightCycle.timeOfDay) {
            case 'morning':
                return '#87CEEB'; // Azul claro
            case 'noon':
                return '#87CEFA'; // Azul céu
            case 'afternoon':
                return '#FF8C69'; // Laranja suave
            case 'night':
                return '#191970'; // Azul noite
            default:
                return '#87CEEB';
        }
    }

    drawWorld() {
        // Desenha árvores
        this.ctx.fillStyle = '#228B22';
        this.world.trees.forEach(tree => {
            // Tronco
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(tree.x - tree.size / 8, tree.y, tree.size / 4, tree.size / 2);
            
            // Copa
            this.ctx.fillStyle = '#228B22';
            this.ctx.beginPath();
            this.ctx.arc(tree.x, tree.y - tree.size / 4, tree.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Desenha rochas
        this.ctx.fillStyle = '#808080';
        this.world.rocks.forEach(rock => {
            this.ctx.beginPath();
            this.ctx.arc(rock.x, rock.y, rock.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Sombra
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.beginPath();
            this.ctx.arc(rock.x + 2, rock.y + 2, rock.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#808080';
        });
    }

    drawDayNightOverlay() {
        // Overlay escuro para simular noite
        const overlayAlpha = this.getDayNightOverlayAlpha();
        
        if (overlayAlpha > 0) {
            this.ctx.fillStyle = `rgba(0, 0, 20, ${overlayAlpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    getDayNightOverlayAlpha() {
        switch (this.dayNightCycle.timeOfDay) {
            case 'morning':
                return 0;
            case 'noon':
                return 0;
            case 'afternoon':
                return 0.1;
            case 'night':
                return 0.5;
            default:
                return 0;
        }
    }
}
