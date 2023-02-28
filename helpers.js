export function addElement(tagName, properties = {}) {
    return Object.assign(document.createElement(tagName), properties);
}
