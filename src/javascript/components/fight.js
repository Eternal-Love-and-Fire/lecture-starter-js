import controls from '../../constants/controls';

export function getHitPower(attack) {
    const criticalHitChance = Math.random() + 1;
    const power = attack * criticalHitChance;
    return power;
}

export function getBlockPower(defense) {
    const dodgeChance = Math.random() + 1;
    const power = defense * dodgeChance;
    return power;
}

export function getDamage({ attack }, { defense }) {
    const hit = getHitPower(attack);
    const block = getBlockPower(defense);
    const damage = hit - block;
    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    const leftFighterIndicator = document.getElementById('left-fighter-indicator');
    const rightFighterIndicator = document.getElementById('right-fighter-indicator');
    const fightInfo = {
        firstFighter: {
            ...firstFighter,
            inAttack: false,
            inDodge: false,
            healthbar: 100,
            lastCriticalHitTime: 0
        },
        secondFighter: {
            ...secondFighter,
            inAttack: false,
            inDodge: false,
            healthbar: 100,
            lastCriticalHitTime: 0
        },
        winner: undefined
    };

    const criticalHitDelay = 10000;

    function checkCriticalHitCombination(keys, criticalHitCombination) {
        return criticalHitCombination.every(key => keys.includes(key));
    }

    return new Promise(resolve => {
        const keysPressed = new Set();

        function handleKeyDown({ code }) {
            keysPressed.add(code);

            const now = Date.now();

            if (
                code === controls.PlayerOneAttack &&
                !fightInfo.firstFighter.inDodge &&
                !fightInfo.secondFighter.inDodge
            ) {
                const damage = getDamage(fightInfo.firstFighter, fightInfo.secondFighter);
                fightInfo.secondFighter.health -= damage;
                fightInfo.secondFighter.healthbar -= (100 / secondFighter.health) * damage;
                rightFighterIndicator.style.width = `${fightInfo.secondFighter.healthbar}%`;
                fightInfo.firstFighter.inAttack = true;
            }

            if (
                code === controls.PlayerTwoAttack &&
                !fightInfo.secondFighter.inDodge &&
                !fightInfo.firstFighter.inDodge
            ) {
                const damage = getDamage(fightInfo.secondFighter, fightInfo.firstFighter);
                fightInfo.firstFighter.health -= damage;
                fightInfo.firstFighter.healthbar -= (100 / firstFighter.health) * damage;
                leftFighterIndicator.style.width = `${fightInfo.firstFighter.healthbar}%`;
                fightInfo.secondFighter.inAttack = true;
            }

            if (code === controls.PlayerOneBlock && !fightInfo.firstFighter.inAttack) {
                fightInfo.firstFighter.inDodge = true;
            }

            if (code === controls.PlayerTwoBlock && !fightInfo.secondFighter.inAttack) {
                fightInfo.secondFighter.inDodge = true;
            }

            if (
                checkCriticalHitCombination(Array.from(keysPressed), controls.PlayerOneCriticalHitCombination) &&
                now - fightInfo.firstFighter.lastCriticalHitTime > criticalHitDelay
            ) {
                const damage = 2 * fightInfo.firstFighter.attack;
                fightInfo.secondFighter.health -= damage;
                fightInfo.secondFighter.healthbar -= (100 / secondFighter.health) * damage;
                rightFighterIndicator.style.width = `${fightInfo.secondFighter.healthbar}%`;
                fightInfo.firstFighter.lastCriticalHitTime = now;
            }

            if (
                checkCriticalHitCombination(Array.from(keysPressed), controls.PlayerTwoCriticalHitCombination) &&
                now - fightInfo.secondFighter.lastCriticalHitTime > criticalHitDelay
            ) {
                const damage = 2 * fightInfo.secondFighter.attack;
                fightInfo.firstFighter.health -= damage;
                fightInfo.firstFighter.healthbar -= (100 / firstFighter.health) * damage;
                leftFighterIndicator.style.width = `${fightInfo.firstFighter.healthbar}%`;
                fightInfo.secondFighter.lastCriticalHitTime = now;
            }
        }

        function handleKeyUp({ code }) {
            keysPressed.delete(code);

            if (code === controls.PlayerOneAttack) {
                fightInfo.firstFighter.inAttack = false;
            }
            if (code === controls.PlayerTwoAttack) {
                fightInfo.secondFighter.inAttack = false;
            }
            if (code === controls.PlayerOneBlock) {
                fightInfo.firstFighter.inDodge = false;
            }
            if (code === controls.PlayerTwoBlock) {
                fightInfo.secondFighter.inDodge = false;
            }
        }

        function checkForWinner() {
            if (fightInfo.firstFighter.health <= 0) {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
                resolve(secondFighter);
            }
            if (fightInfo.secondFighter.health <= 0) {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
                resolve(firstFighter);
            }
        }
        function runGame(event) {
            if (event.type === 'keyup') handleKeyUp(event);
            if (event.type === 'keydown') handleKeyDown(event);
            checkForWinner();
        }
        document.addEventListener('keydown', runGame);
        document.addEventListener('keyup', runGame);
    });
}
