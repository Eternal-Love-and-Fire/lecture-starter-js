import createElement from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

function createWinnerElement(fighter) {
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root fighter-preview___left`
    });
    const fighterImage = createFighterImage(fighter);
    fighterElement.appendChild(fighterImage);

    const fighterName = createElement({
        tagName: 'div',
        className: `fighter-preview___winner`,
        innerText: fighter.name
    });
    fighterElement.appendChild(fighterName);

    return fighterElement;
}

export default function showWinnerModal(fighter) {
    const bodyElement = createWinnerElement(fighter);

    function onClose() {
        document.location.reload();
    }
    const credentials = {
        title: 'And the winner is:',
        bodyElement,
        onClose
    };
    showModal(credentials);
}
