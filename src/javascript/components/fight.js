import Fighter from '../models/Fighter';

class FightingManager {
    static controls = {
        PlayerOneAttack: 'KeyA',
        PlayerOneBlock: 'KeyD',
        PlayerTwoAttack: 'KeyJ',
        PlayerTwoBlock: 'KeyL',
        PlayerOneCriticalHitCombination: ['KeyQ', 'KeyW', 'KeyE'],
        PlayerTwoCriticalHitCombination: ['KeyU', 'KeyI', 'KeyO']
    };

    constructor(firstFighter, secondFighter) {
        this.firstFighter = new Fighter(firstFighter, 'left');
        this.secondFighter = new Fighter(secondFighter, 'right');
        this.criticalHitDelay = 10000;
        this.keysPressed = new Set();

        this.runGame = this.runGame.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    async fight() {
        return new Promise(resolve => {
            document.addEventListener('keydown', this.runGame.bind(this));
            document.addEventListener('keyup', this.runGame.bind(this));
            FightingManager.leftFighterIndicator = document.getElementById('left-fighter-indicator');
            FightingManager.rightFighterIndicator = document.getElementById('right-fighter-indicator');
            this.resolveFight = resolve;
        });
    }

    handleKeyDown(event) {
        const { code } = event;
        this.keysPressed.add(code);
        const now = Date.now();
        if (
            code === FightingManager.controls.PlayerOneAttack &&
            !this.firstFighter.inDodge &&
            !this.secondFighter.inDodge
        ) {
            const damage = this.firstFighter.getDamage(this.secondFighter);
            FightingManager.rightFighterIndicator.style.width = `${this.secondFighter.applyDamage(damage)}%`;
            this.firstFighter.inAttack = true;
        }

        if (
            code === FightingManager.controls.PlayerTwoAttack &&
            !this.secondFighter.inDodge &&
            !this.firstFighter.inDodge
        ) {
            const damage = this.secondFighter.getDamage(this.firstFighter);
            FightingManager.leftFighterIndicator.style.width = `${this.firstFighter.applyDamage(damage)}%`;
            this.secondFighter.inAttack = true;
        }

        if (code === FightingManager.controls.PlayerOneBlock && !this.firstFighter.inAttack) {
            this.firstFighter.inDodge = true;
        }

        if (code === FightingManager.controls.PlayerTwoBlock && !this.secondFighter.inAttack) {
            this.secondFighter.inDodge = true;
        }

        if (
            Fighter.checkCriticalHitCombination(
                Array.from(this.keysPressed),
                FightingManager.controls.PlayerOneCriticalHitCombination
            ) &&
            now - this.firstFighter.lastCriticalHitTime > this.criticalHitDelay
        ) {
            const damage = 2 * this.firstFighter.attack;
            FightingManager.rightFighterIndicator.style.width = `${this.secondFighter.applyDamage(damage)}%`;
            this.firstFighter.lastCriticalHitTime = now;
        }

        if (
            Fighter.checkCriticalHitCombination(
                Array.from(this.keysPressed),
                FightingManager.controls.PlayerTwoCriticalHitCombination
            ) &&
            now - this.secondFighter.lastCriticalHitTime > this.criticalHitDelay
        ) {
            const damage = 2 * this.secondFighter.attack;
            FightingManager.leftFighterIndicator.style.width = `${this.firstFighter.applyDamage(damage)}%`;
            this.secondFighter.lastCriticalHitTime = now;
        }
    }

    handleKeyUp(event) {
        const { code } = event;
        this.keysPressed.delete(code);

        if (code === FightingManager.controls.PlayerOneAttack) this.firstFighter.inAttack = false;
        if (code === FightingManager.controls.PlayerTwoAttack) this.secondFighter.inAttack = false;
        if (code === FightingManager.controls.PlayerOneBlock) this.firstFighter.inDodge = false;
        if (code === FightingManager.controls.PlayerTwoBlock) this.secondFighter.inDodge = false;
    }

    checkForWinner() {
        if (this.firstFighter.health <= 0) {
            this.endFight(this.secondFighter);
        } else if (this.secondFighter.health <= 0) {
            this.endFight(this.firstFighter);
        }
    }

    endFight(winner) {
        document.removeEventListener('keydown', this.runGame.bind(this));
        document.removeEventListener('keyup', this.runGame.bind(this));
        this.resolveFight(winner);
    }

    runGame(event) {
        if (event.type === 'keyup') this.handleKeyUp(event);
        if (event.type === 'keydown') this.handleKeyDown(event);
        this.checkForWinner();
    }
}

export default async function fight(firstFighter, secondFighter) {
    const fightingManager = new FightingManager(firstFighter, secondFighter);
    return fightingManager.fight();
}
