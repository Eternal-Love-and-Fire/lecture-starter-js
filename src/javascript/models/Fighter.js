class Fighter {
    constructor(fighter, position) {
        this.id = fighter._id;
        this.name = fighter.name;
        this.health = fighter.health;
        this.maxHealth = fighter.health;
        this.attack = fighter.attack;
        this.defense = fighter.defense;
        this.source = fighter.source;
        this.position = position;
        this.healthbar = 100;
        this.lastCriticalHitTime = 0;
        this.inAttack = false;
        this.inDodge = false;
    }

    getHitPower() {
        const randomNumber = Math.random() + 1;
        return this.attack * randomNumber;
    }

    getBlockPower() {
        const randomNumber = Math.random() + 1;
        return this.defense * randomNumber;
    }

    getDamage(opponent) {
        const damage = this.getHitPower() - opponent.getBlockPower();
        return damage > 0 ? damage : 0;
    }

    resetStates() {
        this.inAttack = false;
        this.inDodge = false;
    }

    applyDamage(damage) {
        this.health -= damage;
        this.healthbar -= (100 / this.maxHealth) * damage;
        return this.healthbar;
    }

    static checkCriticalHitCombination(keys, criticalHitCombination) {
        return criticalHitCombination.every(key => keys.includes(key));
    }
}

export default Fighter;
