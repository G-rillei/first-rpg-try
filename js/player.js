// Sistema do Jogador

class Player extends TimeAwareEntity {
    constructor(x, y) {
        super('Player');
        
        // Posição
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = 3;
        this.sprintMultiplier = 1.8;
        
        // Stats
        this.maxHealth = 100;
        this.health = 100;
        this.maxMana = 100;
        this.mana = 100;
        this.maxStamina = 100;
        this.stamina = 100;
        
        // Regeneração
        this.healthRegen = 0.5; // por segundo
        this.manaRegen = 1; // por segundo
        this.staminaRegen = 2; // por segundo
        this.staminaDrain = 10; // por segundo ao correr
        
        // Estado
        this.isRunning = false;
        this.isSprinting = false;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackCooldownMax = 500; // ms
        
        // Equipamentos
        this.equippedWeapon = null;
        this.equippedArmor = null;
        this.equippedHelmet = null;
        
        // Direção (para animação)
        this.direction = 'down'; // up, down, left, right
        
        // Controles
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            shift: false,
            space: false
        };
    }

    update(deltaTime) {
        // Atualiza movimento
        this.updateMovement(deltaTime);
        
        // Atualiza regeneração
        this.updateRegeneration(deltaTime);
        
        // Atualiza cooldown de ataque
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Atualiza UI
        this.updateUI();
    }

    updateMovement(deltaTime) {
        let dx = 0;
        let dy = 0;
        
        // Calcula direção do movimento
        if (this.keys.w) dy -= 1;
        if (this.keys.s) dy += 1;
        if (this.keys.a) dx -= 1;
        if (this.keys.d) dx += 1;
        
        // Normaliza vetor diagonal
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707; // 1/sqrt(2)
            dy *= 0.707;
        }
        
        // Verifica se está correndo
        this.isSprinting = this.keys.shift && this.stamina > 0 && (dx !== 0 || dy !== 0);
        
        // Aplica velocidade
        let currentSpeed = this.speed;
        if (this.isSprinting) {
            currentSpeed *= this.sprintMultiplier;
            this.stamina = Math.max(0, this.stamina - this.staminaDrain * (deltaTime / 1000));
        }
        
        // Atualiza posição
        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;
        
        // Atualiza direção para animação
        if (dx > 0) this.direction = 'right';
        else if (dx < 0) this.direction = 'left';
        else if (dy > 0) this.direction = 'down';
        else if (dy < 0) this.direction = 'up';
        
        // Mantém dentro dos limites do canvas
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            this.x = Math.max(this.size / 2, Math.min(canvas.width - this.size / 2, this.x));
            this.y = Math.max(this.size / 2, Math.min(canvas.height - this.size / 2, this.y));
        }
    }

    updateRegeneration(deltaTime) {
        const dt = deltaTime / 1000; // converte para segundos
        
        // Regeneração de vida
        if (this.health < this.maxHealth) {
            this.health = Math.min(this.maxHealth, this.health + this.healthRegen * dt);
        }
        
        // Regeneração de mana
        if (this.mana < this.maxMana) {
            this.mana = Math.min(this.maxMana, this.mana + this.manaRegen * dt);
        }
        
        // Regeneração de stamina (mais rápida quando não está correndo)
        if (!this.isSprinting && this.stamina < this.maxStamina) {
            this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRegen * dt);
        }
    }

    attack() {
        if (this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackCooldown = this.attackCooldownMax;
            
            // Gasta mana
            this.mana = Math.max(0, this.mana - 10);
            
            console.log('Jogador atacou!');
            
            // Reset do estado de ataque após animação
            setTimeout(() => {
                this.isAttacking = false;
            }, 200);
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        console.log(`Jogador recebeu ${amount} de dano. Vida restante: ${this.health}`);
        
        if (this.health === 0) {
            this.onDeath();
        }
    }

    onDeath() {
        console.log('Jogador morreu!');
        // Aqui poderia adicionar lógica de game over
    }

    updateUI() {
        // Atualiza barras de vida, mana e stamina
        this.updateStatBar('health', this.health, this.maxHealth);
        this.updateStatBar('mana', this.mana, this.maxMana);
        this.updateStatBar('stamina', this.stamina, this.maxStamina);
    }

    updateStatBar(stat, current, max) {
        const bar = document.getElementById(`${stat}-bar`);
        const text = document.getElementById(`${stat}-text`);
        
        if (bar) {
            const percentage = (current / max) * 100;
            bar.style.width = `${percentage}%`;
        }
        
        if (text) {
            text.textContent = `${Math.floor(current)}/${max}`;
        }
    }

    draw(ctx) {
        // Salva o contexto
        ctx.save();
        
        // Desenha sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.size / 2 + 5, this.size / 2 - 2, this.size / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cor do jogador (mais brilhante ao correr)
        if (this.isSprinting) {
            ctx.fillStyle = '#FFD700'; // Dourado quando correndo
        } else {
            ctx.fillStyle = '#4CAF50'; // Verde normal
        }
        
        // Desenha corpo
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenha indicador de direção
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        
        switch (this.direction) {
            case 'up':
                ctx.arc(this.x, this.y - this.size / 4, this.size / 6, 0, Math.PI * 2);
                break;
            case 'down':
                ctx.arc(this.x, this.y + this.size / 4, this.size / 6, 0, Math.PI * 2);
                break;
            case 'left':
                ctx.arc(this.x - this.size / 4, this.y, this.size / 6, 0, Math.PI * 2);
                break;
            case 'right':
                ctx.arc(this.x + this.size / 4, this.y, this.size / 6, 0, Math.PI * 2);
                break;
        }
        ctx.fill();
        
        // Efeito de ataque
        if (this.isAttacking) {
            ctx.strokeStyle = '#FF5722';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Restaura o contexto
        ctx.restore();
    }

    // Métodos do Observer para reagir ao ciclo de dia/noite
    onMorning() {
        super.onMorning();
        // Bônus de regeneração de vida pela manhã
        this.healthRegen = 0.7;
    }

    onNoon() {
        super.onNoon();
        // Regeneração normal ao meio-dia
        this.healthRegen = 0.5;
    }

    onAfternoon() {
        super.onAfternoon();
        // Regeneração normal à tarde
        this.healthRegen = 0.5;
    }

    onNight() {
        super.onNight();
        // Regeneração reduzida à noite, mas mais furtivo
        this.healthRegen = 0.3;
    }
}
