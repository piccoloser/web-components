import { addElement } from "./helpers.js";

const dialogExitStyle = `
    .dialog-exit {
        position:absolute;top:1rem; right:1rem;
        display:flex;justify-content:center;
        width:1.5rem;height:1.5rem;cursor:pointer;
        --color: #000;
    }
    .dialog-exit:hover { --color: #222; }
    .dialog-exit::before, .dialog-exit::after {
        content:'';position:absolute;top:-.2rem;transform:rotate(45deg);
        width:5px;height:2rem;border-radius:5px;
        background:var(--color);
    }
    .dialog-exit::after { transform:rotate(-45deg); }
`;

class ModalDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Instance properties.
        this.dialog;
        this.dialogElement = addElement("div", { classList: "dialog", role: "dialog" });
        this.open = false;
        this.template = Object.values(this.children)
            .map(e => e.hasAttribute("slot") ? addElement("slot") : e);

        // Add styling.
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

            ${dialogExitStyle}
            .dialog-exit { --color:var(--modal-x-color, currentColor); }
            .dialog-exit:hover { --color:var(--modal-x-hover-color, #222); }

            #wrapper {
                position:fixed;top:0;bottom:0;left:0;right:0;
                z-index:3;display:none;
            }
            `,
        }));
    }

    /** Clear wrapper and dialog contents. */
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
        // Apply close and hide functions to corresponding elements.
        Object.entries({
            exit: () => this.close(),
            hide: () => this.hide(),
        }).forEach(([k, v]) => {
            let elements = this.querySelectorAll(`[data-name="${k}"]`);
            if (elements) elements.forEach(element => this.#bindFunction(element, v));
        });
    }

    /**
     * Display the modal dialog and fill in its contents according to the `data` argument.
     * 
     * `data`: Key-value pairs corresponding to elements'
     * `data-name` attribute and their desired `innerHTML`.
     * 
     * `required`: Whether or not the user should be able to
     * close this dialog by clicking the backdrop or exit button.
     */
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

    /** Initialize the default layout and elements of the dialog, then take focus. */
    #initDisplay(required) {
        // Clear any existing dialog content.
        if (this.open) this.close();

        this.wrapper = addElement("div", {
            id: "wrapper",
            style: "display: flex",
            tabIndex: -1,
        });

        this.wrapper.appendChild(addElement("div", {
            classList: "backdrop",
            onclick: required ? 0 : () => this.close(),
        }))

        this.dialog = this.wrapper.appendChild(this.dialogElement);
        this.dialog.append(...this.template);

        this.shadowRoot.append(this.wrapper);
        this.open = true;
        this.wrapper.focus();
    }
}

class NonModalDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = addElement("div", { classList: "wrapper" });

        const style = addElement("style", {
            textContent: `
                * { box-sizing: border-box; }
                
                .content {
                    position: absolute;top: 0;left: 50%;
                    transform: translateX(-50%);overflow: hidden;
                    display: flex;flex-direction: column;align-items: center;
                    padding: 1rem;padding-right: 3rem;margin: .5rem;
                    width: 50%;max-width: 80vw;
                    background-color: var(--nm-bg-color, #ddd);
                    box-shadow: 0 0 4px #000;
                    border-radius: 5px;
                    --bg: #222;
                }

                .wrapper {
                    display: none;z-index: 3;
                    justify-content: center;
                    width: 100%;
                    color: var(--nm-color, #000);
                }

                .wrapper.top {
                    position: fixed;top: 0;left: 50%;
                    transform: translateX(-50%);
                }

                ${dialogExitStyle}
                .dialog-exit {
                    top: 25%;
                    --color: var(--nm-x-color, currentColor);
                }
                .dialog-exit:hover { --color: var(--nm-x-hover-color, #222); }

                @keyframes modal-lifetime {
                    from {width: 100%;}
                    to {width: 0;}
                }
            `,
        });

        this.wrapper.classList.add("top");
        this.shadowRoot.append(style, this.wrapper);
    }

    display(message, timeout = 10) {
        let content = this.wrapper.appendChild(addElement("div", { classList: "content" }));

        content.appendChild(addElement("div", {
            classList: "content-body",
            textContent: message,
        }));

        content.appendChild(addElement("div", {
            classList: "dialog-exit",
            onclick: () => this.close(),
        }));

        content.appendChild(addElement("div", {
            style: `
                position: absolute;
                bottom: 0;left: 0;
                height: 4px;width: 100%;
                background: var(--nm-bar-color, #aaa); 
                animation: modal-lifetime ${timeout}s linear;
            `
        }));

        this.wrapper.style.display = "flex";

        if (timeout > 0)
            setTimeout(() => this.close(), timeout * 1000);
    }

    close() {
        this.wrapper.innerHTML = "";
        this.wrapper.display = "none";
    }
}

customElements.define("modal-dialog", ModalDialog);
customElements.define("nm-dialog", NonModalDialog);
