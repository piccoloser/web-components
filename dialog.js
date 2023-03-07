import { addElement } from "./helpers.js";
import { Color } from "./color.js";

function closeDialog(wrapper) {
    Array.from(wrapper.children).forEach(i => i.remove());
    wrapper.style.display = "none";
}

class ModalDialog extends HTMLElement {
    constructor(defaultBgColor = "rgba(200, 200, 200, 1)", defaultColor = "#000") {
        super();
        this.attachShadow({ mode: "open" });

        const style = addElement("style", {
            textContent: `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            #backdrop {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: -1;
                background-color: #0008;
            }

            .close {
                color: red;
            }

            #dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                background-color: #fff;
                border-radius: 5px;
            }

            #wrapper {
                position: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 3;
                display: none;
            }
            `,
        });

        this.wrapper = addElement("div", {
            id: "wrapper",
            innerHTML: `
                <div id="backdrop"></div>
                <div id="dialog">
                    <div id="title-block">
                        <h2 id="title"></h2>
                    </div>
                    <div id="content"></div>
                </div>
            `,
        });

        this.bgColor = Color.fromComputedStyle(this, defaultBgColor);
        this.color = Color.fromComputedStyle(this, defaultColor, "color");

        this.shadowRoot.append(style, this.wrapper);

        document.getElementById('modal').displayTemplate('title', 'modal-1');
    }

    display(title, body, required = false) {
        this.wrapper.style.display = "flex";
        this.#id("title").textContent = title;
        this.#id("content").innerHTML = body;
    }

    displayTemplate(title, bodyId, required = false) {
        this.wrapper.style.display = "flex";
        this.#id("title").textContent = title;

        // Create a deep copy of the template element.
        const content = document
            .querySelector(`#${bodyId}`)
            .content
            .cloneNode(true);

        // Append the elements within the template to #content.
        this.#id("content").append(...content.children);
    }

    /**
     * Shorthand for ```this.wrapper.querySelector(`#${name}`)```.
     */
    #id(name) {
        return this.wrapper.querySelector(`#${name}`);
    }
}

customElements.define("modal-dialog", ModalDialog);