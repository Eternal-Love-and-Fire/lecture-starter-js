export default function createElement({ tagName, className, attributes = {}, innerText = '' }) {
    const element = document.createElement(tagName);

    if (className) {
        const classNames = className.split(' ').filter(Boolean);
        element.classList.add(...classNames);
    }

    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));
    element.innerText = innerText;
    return element;
}
