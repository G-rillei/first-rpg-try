// Sistema de Inventário

class InventoryItem {
    constructor(id, name, type, icon, description, effect = null) {
        this.id = id;
        this.name = name;
        this.type = type; // 'weapon', 'equipment', 'consumable', 'item'
        this.icon = icon;
        this.description = description;
        this.effect = effect; // Função que será executada ao usar o item
    }

    use(player) {
        if (this.effect && typeof this.effect === 'function') {
            this.effect(player);
            console.log(`Usando ${this.name}`);
            return true;
        }
        return false;
    }
}

class Inventory {
    constructor() {
        this.items = {
            weapons: [],
            equipment: [],
            consumables: [],
            items: []
        };
        this.maxSlots = 20;
        this.isOpen = false;
        
        // Adiciona alguns itens iniciais
        this.addStartingItems();
    }

    addStartingItems() {
        // Armas
        this.addItem(new InventoryItem(
            'sword1',
            'Espada de Ferro',
            'weapon',
            '⚔️',
            'Uma espada básica de ferro. Dano: +10',
            (player) => { player.equippedWeapon = 'sword1'; }
        ));

        this.addItem(new InventoryItem(
            'bow1',
            'Arco Longo',
            'weapon',
            '🏹',
            'Um arco para ataques à distância. Dano: +8',
            (player) => { player.equippedWeapon = 'bow1'; }
        ));

        // Equipamentos
        this.addItem(new InventoryItem(
            'armor1',
            'Armadura de Couro',
            'equipment',
            '🛡️',
            'Armadura leve que oferece proteção básica. Defesa: +5',
            (player) => { player.equippedArmor = 'armor1'; }
        ));

        this.addItem(new InventoryItem(
            'helmet1',
            'Elmo de Bronze',
            'equipment',
            '⛑️',
            'Protege a cabeça. Defesa: +3',
            (player) => { player.equippedHelmet = 'helmet1'; }
        ));

        // Consumíveis
        this.addItem(new InventoryItem(
            'potion_health',
            'Poção de Vida',
            'consumable',
            '❤️',
            'Restaura 50 pontos de vida',
            (player) => { 
                player.health = Math.min(player.maxHealth, player.health + 50);
                this.removeItem('potion_health', 'consumables');
            }
        ));

        this.addItem(new InventoryItem(
            'potion_mana',
            'Poção de Mana',
            'consumable',
            '💧',
            'Restaura 50 pontos de mana',
            (player) => { 
                player.mana = Math.min(player.maxMana, player.mana + 50);
                this.removeItem('potion_mana', 'consumables');
            }
        ));

        this.addItem(new InventoryItem(
            'potion_stamina',
            'Poção de Stamina',
            'consumable',
            '⚡',
            'Restaura 50 pontos de stamina',
            (player) => { 
                player.stamina = Math.min(player.maxStamina, player.stamina + 50);
                this.removeItem('potion_stamina', 'consumables');
            }
        ));

        // Itens gerais
        this.addItem(new InventoryItem(
            'key1',
            'Chave Enferrujada',
            'item',
            '🔑',
            'Uma chave antiga que pode abrir portas misteriosas'
        ));

        this.addItem(new InventoryItem(
            'gem1',
            'Gema Brilhante',
            'item',
            '💎',
            'Uma gema valiosa que brilha com luz própria'
        ));
    }

    addItem(item) {
        const category = this.getCategoryFromType(item.type);
        if (this.getTotalItems() < this.maxSlots) {
            this.items[category].push(item);
            console.log(`Item adicionado: ${item.name}`);
            return true;
        }
        console.log('Inventário cheio!');
        return false;
    }

    removeItem(itemId, category) {
        const index = this.items[category].findIndex(item => item.id === itemId);
        if (index > -1) {
            const removed = this.items[category].splice(index, 1)[0];
            console.log(`Item removido: ${removed.name}`);
            return removed;
        }
        return null;
    }

    getItem(itemId) {
        for (const category in this.items) {
            const item = this.items[category].find(item => item.id === itemId);
            if (item) return item;
        }
        return null;
    }

    getCategoryFromType(type) {
        switch (type) {
            case 'weapon':
                return 'weapons';
            case 'equipment':
                return 'equipment';
            case 'consumable':
                return 'consumables';
            default:
                return 'items';
        }
    }

    getTotalItems() {
        return Object.values(this.items).reduce((total, category) => total + category.length, 0);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('inventory-panel');
        if (panel) {
            if (this.isOpen) {
                panel.classList.remove('hidden');
                this.render();
            } else {
                panel.classList.add('hidden');
            }
        }
    }

    render() {
        // Renderiza cada categoria
        this.renderCategory('weapons', 'weapons-list');
        this.renderCategory('equipment', 'equipment-list');
        this.renderCategory('consumables', 'consumables-list');
        this.renderCategory('items', 'items-list');
    }

    renderCategory(category, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        this.items[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
            `;
            
            itemElement.addEventListener('click', () => {
                this.onItemClick(item);
            });
            
            container.appendChild(itemElement);
        });

        // Adiciona placeholder se vazio
        if (this.items[category].length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum item</p>';
        }
    }

    onItemClick(item) {
        console.log(`Item clicado: ${item.name}`);
        // Aqui poderia abrir um menu de contexto ou usar o item diretamente
        if (confirm(`Deseja usar ${item.name}?`)) {
            if (window.game && window.game.player) {
                item.use(window.game.player);
                this.render(); // Atualiza o display
            }
        }
    }
}
