import { addElement } from "./helpers.js";

class ModalDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.dialog;
        this.dialogElement = addElement("div", {
            classList: "dialog",
            role: "dialog",
        });

        this.template = Object.values(this.children);
        this.shadowRoot.append(addElement("style", {
            textContent: `
            * {margin:0;padding:0;box-sizing:border-box;}

            .backdrop {
                position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;
                background-color:var(--modal-bd-color, #0008);
            }

            .dialog {
                position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);
                display:flex;flex-direction:column;gap:.5rem;
                padding:1rem;min-width: calc(320px - 1rem);border-radius:5px;
                background-color:var(--modal-bg-color, #fff);
                color: var(--modal-color, #000);
            }

            .content {display:flex;flex-direction:column;gap:.5rem;}

            .dialog-exit {
                position:absolute;top:1rem; right:1rem;
                display:flex;justify-content:center;
                width:1.5rem;height:1.5rem;cursor:pointer;
                --color:var(--modal-x-color, var(--modal-color, #000));
            }
            .dialog-exit:hover { --color:var(--modal-x-hover-color, #222); }
            .dialog-exit::before, .dialog-exit::after {
                content:'';position:absolute;top:-.2rem;transform:rotate(45deg);
                width:5px;height:2rem;border-radius:5px;
                background:var(--color);
            }
            .dialog-exit::after { transform:rotate(-45deg); }

            #wrapper {
                position:fixed;top:0;bottom:0;left:0;right:0;
                z-index:3;display:none;
            }
            `,
        }));
    }

    close = () => {
        [this.wrapper, this.dialog].forEach(e => {
            e.innerHTML = "";
            e.remove();
        })
    }

    hide = () => this.wrapper.style.display = "none";
    show = () => {
        this.wrapper.style.display = "flex";
        this.wrapper.focus();
    }

    connectedCallback() {
        Object.entries({
            exit: () => this.close(),
            hide: () => this.hide(),
        }).forEach(([k, v]) => {
            let elements = this.querySelectorAll(`[data-name="${k}"]`);
            if (elements) elements.forEach(element => this.#bindFunction(element, v));
        });
    }

    display(data, required = false) {
        this.#initDisplay(required);

        // If this dialog is not required, add the exit button.
        if (!required) {
            let exitButton = this.dialog.appendChild(addElement("div", {
                classList: "dialog-exit",
                title: "Exit Dialog",
            }));

            this.#bindFunction(exitButton, this.close);
        }

        // Remove any hidden elements.
        this.dialog.querySelectorAll("[data-name='hidden']")
            .forEach(i => i.remove());

        // Replace the innerHTML of elements defined in `data`.
        Object.entries(data).forEach(([k, v]) => {
            let e = this.dialog.querySelector(`[data-name=${k}]`)
            if (e) e.innerHTML = v;
        });
    }

    /** Make an element keyboard-accessible and bind a function to it. */
    #bindFunction(element, fn) {
        element.tabIndex = 0;
        element.onclick = fn;
        element.onkeydown = e => ["Enter", " "].includes(e.key) ? fn() : 0;
    }

    /** Initialize the default layout and elements of the dialog. */
    #initDisplay(required) {
        this.wrapper = addElement("div", {
            id: "wrapper",
            style: "display: flex",
            tabIndex: -1,
        });

        this.wrapper.appendChild(addElement("div", {
            classList: "backdrop",
            onclick: required ? {} : () => this.close(),
        }))

        this.dialog = this.wrapper.appendChild(this.dialogElement);
        this.dialog.append(...this.template);

        this.shadowRoot.append(this.wrapper);
        this.wrapper.focus();
    }
}

customElements.define("modal-dialog", ModalDialog);