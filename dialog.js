import { addElement } from "./helpers.js";
import { Color } from "./color.js";

function closeDialog(wrapper) {
    Array.from(wrapper.children).forEach(i => i.remove());
    wrapper.style.display = "none";
}

const btnCloseStyle = `
    #btn-close {
        position: absolute;
        display: flex;
        justify-content: center;
        top: 50%;
        right: .5rem; 
        transform: translateY(-50%);
        width: 2rem;
        height: 2rem;
        cursor: pointer;

        --bg: #000;
    }
    #btn-close:hover {
        --bg: #222;
    }
    #btn-close::before, #btn-close::after {
        content: '';
        display: block;
        position: absolute;
        width: 5px;
        height: 100%;
        transform: rotate(-45deg);
        border-radius: 3px;
        background-color: var(--bg);
    }
    #btn-close::after {
        transform: rotate(45deg);
    }
`;

class ModalDialog extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" });

        this.wrapper = addElement("div", { id: "wrapper" });

        const defaultBg = "rgba(200, 200, 200, 1)";
        this.bgColor = Color.fromComputedStyle(this, defaultBg);
        this.bodyBgColor = this.bgColor.rgba;
        this.titleBgColor = this.bgColor.brightness(-20).rgba;

        const style = addElement("style", {
            textContent: `
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #0005;
                }

                ${btnCloseStyle}

                #dialog-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                    z-index: 1;

                    min-width: 320px;
                    max-width: 900px;
                    max-height: 600px;

                    border-radius: 5px;

                    color: ${this.style.getPropertyValue("color") || "#000"};
                }

                #dialog-title {
                    position: relative;
                    display: block;
                    width: 100%;
                    padding: .5rem 4rem;
                    text-align: center;
                    background-color: ${this.titleBgColor || "#888"};
                }

                #dialog-body {
                    display: block;

                    width: 100%;
                    height: 100%;
                    padding: 2rem;

                    background: ${this.bodyBgColor || "#aaa"};
                }

                #wrapper {
                    position: fixed;
                    top: 0; left: 0;
                    z-index: 2;

                    display: none;
                    align-items: center;
                    justify-content: center;

                    width: 100vw;
                    height: 100vh;
                }
            `,
        });

        this.shadowRoot.append(style, this.wrapper);
    }

    display(title = "Dialog", message, required = false) {
        if (this.wrapper.querySelector("#dialog-box"))
            closeDialog(this.wrapper);

        this.wrapper.style.display = "flex";

        let btnClose;
        if (!required)
            btnClose = addElement("div", { id: "btn-close" });

        let backdrop = addElement("div", {
            id: "backdrop",
            onclick: () => required ? {} : closeDialog(this.wrapper),
        });

        let dialogBox = addElement("div", { id: "dialog-box" });
        dialogBox.appendChild(addElement("h2", {
            id: "dialog-title",
            textContent: title,
        }));

        let dialogBody = dialogBox.appendChild(addElement("div", { id: "dialog-body" }))
        dialogBody.appendChild(addElement("div", { innerHTML: message }));

        this.wrapper.append(backdrop, dialogBox);

        if (btnClose) {
            dialogBox.querySelector("#dialog-title").append(btnClose);
            dialogBox.querySelector("#btn-close").onclick = () => closeDialog(this.wrapper);
        }

        if (this.wrapper.querySelector("#close"))
            this.wrapper.querySelector("#close").onclick = () => closeDialog(this.wrapper);
    }
}

class NonModalDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.wrapper = addElement("div", { id: "wrapper" });

        const defaultBg = "rgba(200, 200, 200, 1)";
        this.bgColor = Color.fromComputedStyle(this, defaultBg);

        const style = addElement("style", {
            textContent: `
                * {
                    box-sizing: border-box;
                }

                ${btnCloseStyle}
                
                #content {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    overflow: hidden;

                    display: flex;
                    flex-direction: column; 
                    align-items: center;
                    padding: 1rem; 
                    padding-right: 3rem;
                    margin: .5rem;
                    width: 50%;
                    max-width: 80vw;
                    background-color: ${this.bgColor.rgba};
                    border-radius: 5px;

                    --bg: #222;
                }

                #wrapper {
                    display: none;
                    z-index: 3;
                    justify-content: center;
                    width: 100%;
                    color: ${this.style.getPropertyValue("color") || "#000"};
                }

                #wrapper.top {
                    position: fixed;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }

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
        let content = this.wrapper.appendChild(addElement("div", { id: "content" }));
        content.appendChild(addElement("div", {
            id: "content-body",
            innerHTML: message,
        }));

        content.appendChild(addElement("div", {
            id: "btn-close",
            onclick: () => closeDialog(this.wrapper),
        }));

        content.appendChild(addElement("div", {
            style: `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                width: 100%;
                background: ${this.bgColor.brightness(-50).rgba}; 
                animation: modal-lifetime ${timeout}s linear;
            `
        }));

        this.wrapper.style.display = "flex";

        if (timeout > 0)
            setTimeout(() => closeDialog(this.wrapper), timeout * 1000);
    }
}

customElements.define("modal-dialog", ModalDialog);
customElements.define("nm-dialog", NonModalDialog);
