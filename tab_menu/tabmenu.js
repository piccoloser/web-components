function addElement(tagName, properties) {
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
        if (!this.style.backgroundColor) {
            for (let i = 0; i < 3; i++)
                bgColorParts.push(200);
        }

        // Parse manual background color.
        else {
            this.style.backgroundColor.split(", ").forEach(value => {
                bgColorParts.push(parseFloat(value.replace("rgb(", "").replace("rgba(", "")));
            })
        }

        // Add alpha value if not already set.
        if (bgColorParts.length == 3)
            bgColorParts.push(1);

        this.backgroundColor = `rgba(${bgColorParts.join(", ")})`;

        // Get alpha value and decrease it for inactive tab color.
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
                    border-bottom: solid 1px ${this.backgroundColor};
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
                    display: block;
                }

                #wrapper>div:not(:first-child) {
                    display: none !important;
                }
            `,
        });

        this.open = !this.hasAttribute("closed");
        this.divs = [];

        const wrapper = addElement("div", { id: "wrapper" });
        const header = addElement("header", { id: "tabs" });

        wrapper.appendChild(header);

        Object.entries(this.children).forEach(([n, div]) => {
            let tab = addElement("a", {
                id: `tab-${n}`,
                innerHTML: `${this.hasAttribute("numbered") ? `${n}: ` : ""
                    }${div.getAttribute("name")}`,
                onclick: () => div.hasAttribute("disabled") ? {} : this.openTab(n),
            });

            header.appendChild(tab);
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

    openTab(index) {
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
