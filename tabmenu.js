function addElement(tagName, properties = {}) {
    return Object.assign(document.createElement(tagName), properties);
}

class TabMenu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Add shadow DOM.
        this.attachShadow({ mode: "open" });

        // Default background = rgba(200, 200, 200, 1)
        let bgColorParts = [];
        if (!this.style.backgroundColor)
            bgColorParts.push(200, 200, 200);

        // Parse user-defined background color.
        else
            this.style.backgroundColor.split(", ").forEach(value => {
                bgColorParts.push(parseFloat(value.replace(/.+\(/g, "")));
            })

        // Add default alpha value if not already set.
        if (bgColorParts.length == 3)
            bgColorParts.push(1);

        this.backgroundColor = `rgba(${bgColorParts.join(", ")})`;

        // Decrease alpha value by .2 (minimum of 0) for inactive tabs.
        let alpha = bgColorParts.pop();
        this.inactiveBackgroundColor = `rgba(${bgColorParts.join(", ")}, ${Math.max(0, alpha - .2)})`;

        // Add styling.
        const style = addElement("style", {
            textContent: `
                a[id^="tab-"] {
                    padding: .25rem .5rem;
                    border-radius: 3px 3px 0 0;
                    background-color: ${this.inactiveBackgroundColor};
                    color: #000;
                    cursor: pointer;
                    user-select: none;
                }

                a[id^="tab-"]:hover {
                    background-color: ${this.backgroundColor};
                }

                a[id^="tab-"].open {
                    background-color: ${this.backgroundColor};
                }

                #tabs {
                    display: flex;
                    gap: .25rem;
                    padding: 0 .25rem;
                    border-bottom: solid 1px ${this.backgroundColor};
                }

                #tabs.minimized {
                    border-bottom: solid 1px ${this.inactiveBackgroundColor};
                }

                #wrapper {
                    display: flex;
                    flex-direction: column;
                    margin: 1rem 0;
                }

                #wrapper>div:not(:first-child) {
                    display: none;
                    padding: 1rem;
                    box-sizing: border-box;
                    background-color: ${this.backgroundColor};
                    color: #000;
                }

                #wrapper>div:not(:first-child).open {
                    display: block
                }

                #wrapper .disabled {
                    opacity: .25;
                    cursor: not-allowed;
                }
            `,
        });

        this.open = !this.hasAttribute("closed");
        this.divs = [];

        const wrapper = addElement("div", { id: "wrapper" });
        this.header = addElement("header", { id: "tabs" });
        wrapper.appendChild(this.header);

        Object.entries(this.children).forEach(([n, div]) => {
            let tab = addElement("a", {
                id: `tab-${n}`,

                innerHTML: `${this.hasAttribute("numbered") ?
                    `${n}: ` : ""}${div.getAttribute("name")}`,

                onclick: () => div.hasAttribute("disabled") ?
                    {} : div.classList.contains("open") ?
                        this.minimize() : this.openTab(n),
            });

            if (div.hasAttribute("disabled"))
                tab.classList.add("disabled");

            this.header.appendChild(tab);
            wrapper.appendChild(div);

            this.divs.push([tab, div]);
        });

        if (this.open)
            this.openTab(this.getTab(this.getAttribute("open")));

        this.shadowRoot.append(style, wrapper);
    }

    getTab(name) {
        let index = 0;
        this.divs.forEach(([_, div], n) => {
            if (div.getAttribute("name") == name)
                index = n;
        });

        return index;
    }

    minimize() {
        this.header.classList.add("minimized");
        this.divs.forEach(([tab, div]) => {
            tab.classList.remove("open");
            div.classList.remove("open");
        });
    }

    openTab(index) {
        this.header.classList.remove("minimized");
        this.divs.forEach(([tab, div]) => {
            if (div == this.divs[index][1]) {
                tab.classList.add("open");
                div.classList.add("open");
            }

            else {
                tab.classList.remove("open");
                div.classList.remove("open");
            }
        });
    }

}

customElements.define("tab-menu", TabMenu);
