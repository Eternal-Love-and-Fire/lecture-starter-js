import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    if (fighter === undefined) return '';
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });
    const fighterImage = createFighterImage(fighter);
    fighterElement.appendChild(fighterImage);
    let reverse = '';
    if (position === 'right') {
        reverse = 'fighter-preview___info_reverse';
    }
    const { name } = fighter;
    const fighterName = createElement({
        tagName: 'div',
        className: `fighter-preview___info ${reverse}`,
        innerText: name
    });
    fighterElement.appendChild(fighterName);

    const fighterHealth = createElement({
        tagName: 'div',
        className: `fighter-preview___info ${reverse}`,
        innerText: `Health: ${fighter.health}`
    });
    fighterElement.appendChild(fighterHealth);

    const fighterAttack = createElement({
        tagName: 'div',
        className: `fighter-preview___info ${reverse}`,
        innerText: `Attack: ${fighter.attack}`
    });
    fighterElement.appendChild(fighterAttack);

    const fighterDefense = createElement({
        tagName: 'div',
        className: `fighter-preview___info ${reverse}`,
        innerText: `Defense: ${fighter.defense}`
    });
    fighterElement.appendChild(fighterDefense);

    return fighterElement;
}
