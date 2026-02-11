// Observer Pattern Implementation
// Sistema de observadores para permitir que entidades reajam a eventos

class Subject {
    constructor() {
        this.observers = [];
    }

    // Adiciona um observador
    addObserver(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            console.log('Observer adicionado:', observer.constructor.name);
        }
    }

    // Remove um observador
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
            console.log('Observer removido:', observer.constructor.name);
        }
    }

    // Notifica todos os observadores
    notifyObservers(data) {
        this.observers.forEach(observer => {
            if (typeof observer.onNotify === 'function') {
                observer.onNotify(data);
            }
        });
    }
}

// Interface para Observers (não é necessário em JS, mas é uma boa prática)
class Observer {
    onNotify(data) {
        throw new Error('Observer.onNotify() deve ser implementado');
    }
}
