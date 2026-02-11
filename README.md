# RPG Adventure - Jogo 2D Top-Down

Um jogo RPG 2D top-down completo desenvolvido com HTML, JavaScript e CSS, apresentando um sistema de inventário completo, ciclo dia/noite com Observer Pattern, e mecânicas de combate.

## 🎮 Características

### Sistemas Principais
- **Personagem Jogável**: Movimento completo com WASD e corrida com Shift
- **Sistema de Stats**: Vida, Mana e Stamina com regeneração automática
- **Sistema de Inventário**: 4 categorias organizadas (Armas, Equipamentos, Consumíveis, Itens)
- **Ciclo Dia/Noite**: Sistema baseado no padrão Observer com 4 períodos (Manhã, Meio-dia, Tarde, Noite)
- **Sistema de Combate**: Ataques com cooldown e custo de mana
- **Mundo Gerado**: Árvores e rochas proceduralmente colocadas

### Padrão Observer
O jogo implementa o padrão de design Observer para o ciclo dia/noite:
- Entidades podem se inscrever para reagir às mudanças de período do dia
- O jogador adapta seu comportamento baseado no período (ex: regeneração de vida varia)
- Sistema extensível para adicionar mais entidades observadoras

### Interface Moderna
- Design minimalista e amigável
- Animações fluídas e agradáveis
- Barras de status com transições suaves
- Sistema de inventário modal
- Feedback visual para diferentes períodos do dia

## 🎯 Controles

| Tecla | Ação |
|-------|------|
| **W, A, S, D** | Mover personagem |
| **Shift** | Correr (consome stamina) |
| **Espaço** | Atacar (consome mana) |
| **I** | Abrir/Fechar inventário |
| **E** | Usar item próximo |

## 🚀 Como Jogar

1. Clone o repositório:
```bash
git clone https://github.com/G-rillei/first-rpg-try.git
```

2. Abra o `index.html` em seu navegador ou inicie um servidor web local:
```bash
cd first-rpg-try
python3 -m http.server 8080
```

3. Acesse `http://localhost:8080` no navegador

## 📁 Estrutura do Projeto

```
first-rpg-try/
├── index.html              # Estrutura HTML principal
├── styles.css              # Estilos CSS modernos
├── js/
│   ├── observer.js         # Implementação do padrão Observer
│   ├── dayNightCycle.js    # Sistema de ciclo dia/noite
│   ├── inventory.js        # Sistema de inventário
│   ├── player.js           # Classe do jogador
│   ├── game.js             # Motor principal do jogo
│   └── main.js             # Ponto de entrada
└── README.md
```

## 🎨 Recursos Visuais

### Ciclo Dia/Noite
- **Manhã** 🌅: Céu azul claro, regeneração de vida aumentada
- **Meio-dia** ☀️: Céu brilhante, período normal
- **Tarde** 🌇: Tons alaranjados, período de transição
- **Noite** 🌙: Escuro com overlay, regeneração reduzida

### Sistema de Inventário
- **Armas**: Espada de Ferro, Arco Longo
- **Equipamentos**: Armadura de Couro, Elmo de Bronze
- **Consumíveis**: Poções de Vida, Mana e Stamina
- **Itens**: Chave Enferrujada, Gema Brilhante

## 🔧 Tecnologias Utilizadas

- **HTML5 Canvas**: Para renderização do jogo
- **JavaScript ES6+**: Lógica do jogo com classes modernas
- **CSS3**: Animações e design responsivo
- **Observer Pattern**: Para sistema de eventos do ciclo dia/noite

## 📝 Próximos Passos (Futuras Melhorias)

- [ ] Adicionar inimigos com IA
- [ ] Sistema de quests
- [ ] Múltiplos mapas/áreas
- [ ] Sistema de save/load
- [ ] Efeitos sonoros e música
- [ ] Mais itens e equipamentos
- [ ] Sistema de níveis e experiência
- [ ] NPCs interativos

## 👤 Autor

Desenvolvido como um projeto de demonstração de um jogo RPG 2D completo com padrões de design modernos.

## 📄 Licença

Este projeto está disponível para uso educacional e demonstração.