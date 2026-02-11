// Sistema de Dia e Noite usando Observer Pattern

class DayNightCycle extends Subject {
    constructor() {
        super();
        this.timeOfDay = 'morning'; // morning, noon, afternoon, night
        this.timeInMinutes = 0; // 0-1440 (24 horas * 60 minutos)
        this.cycleSpeed = 1; // Multiplicador de velocidade (1 minuto real = cycleSpeed minutos no jogo)
        this.isRunning = false;
        this.timeIcons = {
            morning: '🌅',
            noon: '☀️',
            afternoon: '🌇',
            night: '🌙'
        };
        this.timeLabels = {
            morning: 'Manhã',
            noon: 'Meio-dia',
            afternoon: 'Tarde',
            night: 'Noite'
        };
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.tick();
            console.log('Ciclo de dia/noite iniciado');
        }
    }

    stop() {
        this.isRunning = false;
        console.log('Ciclo de dia/noite pausado');
    }

    tick() {
        if (!this.isRunning) return;

        // Avança o tempo
        this.timeInMinutes += this.cycleSpeed;
        
        // Reset após 24 horas
        if (this.timeInMinutes >= 1440) {
            this.timeInMinutes = 0;
        }

        // Determina o período do dia
        const previousTime = this.timeOfDay;
        this.timeOfDay = this.getTimeOfDay();

        // Notifica observadores se o período mudou
        if (previousTime !== this.timeOfDay) {
            this.notifyObservers({
                timeOfDay: this.timeOfDay,
                timeInMinutes: this.timeInMinutes,
                previousTime: previousTime
            });
            console.log(`Mudança de período: ${previousTime} -> ${this.timeOfDay}`);
        }

        // Atualiza a UI
        this.updateUI();

        // Próximo tick
        setTimeout(() => this.tick(), 100); // Atualiza a cada 100ms
    }

    getTimeOfDay() {
        const hours = Math.floor(this.timeInMinutes / 60);
        
        if (hours >= 6 && hours < 12) {
            return 'morning';
        } else if (hours >= 12 && hours < 17) {
            return 'noon';
        } else if (hours >= 17 && hours < 20) {
            return 'afternoon';
        } else {
            return 'night';
        }
    }

    updateUI() {
        const timeIcon = document.getElementById('time-icon');
        const timeText = document.getElementById('time-text');
        const canvas = document.getElementById('game-canvas');

        if (timeIcon && timeText) {
            timeIcon.textContent = this.timeIcons[this.timeOfDay];
            timeText.textContent = this.timeLabels[this.timeOfDay];
        }

        // Aplica tema visual baseado no período do dia
        if (canvas) {
            canvas.className = `${this.timeOfDay}-theme`;
        }
    }

    getTimeString() {
        const hours = Math.floor(this.timeInMinutes / 60);
        const minutes = this.timeInMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    setCycleSpeed(speed) {
        this.cycleSpeed = speed;
        console.log(`Velocidade do ciclo alterada para: ${speed}x`);
    }
}

// Exemplo de Observer que reage ao ciclo de dia/noite
class TimeAwareEntity extends Observer {
    constructor(name) {
        super();
        this.name = name;
    }

    onNotify(data) {
        console.log(`${this.name} detectou mudança de tempo:`, data);
        
        // Comportamentos diferentes baseados no período do dia
        switch (data.timeOfDay) {
            case 'morning':
                this.onMorning();
                break;
            case 'noon':
                this.onNoon();
                break;
            case 'afternoon':
                this.onAfternoon();
                break;
            case 'night':
                this.onNight();
                break;
        }
    }

    onMorning() {
        console.log(`${this.name}: É manhã! Tempo de começar o dia.`);
    }

    onNoon() {
        console.log(`${this.name}: Meio-dia! O sol está alto.`);
    }

    onAfternoon() {
        console.log(`${this.name}: Tarde! O dia está terminando.`);
    }

    onNight() {
        console.log(`${this.name}: Noite! Hora de descansar ou explorar nas sombras.`);
    }
}
