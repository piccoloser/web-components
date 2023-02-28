import { addElement } from "./helpers.js";

class TabMenu extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.wrapper = addElement("div", { id: "wrapper" });
        this.header = addElement("header", { id: "tabs" });
        this.open = !this.hasAttribute("closed");
        this.divs = [];

        [this.backgroundColor, this.inactiveBackgroundColor] = this.#parseBackgroundColor();
        this.color = this.style.color;

        this.wrapper.appendChild(this.header);
    }

    connectedCallback() {
        // Add styling.
        const style = addElement("style", {
            textContent: `
                a[id^="tab-"] {
                    padding: .25rem .5rem;
                    border-radius: 3px 3px 0 0;
                    background-color: ${this.inactiveBackgroundColor};
                    color: ${this.color};
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
                    color: ${this.color};
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
                    color: ${this.color};
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

        // Add tabs to header.
        Object.entries(this.children).forEach(([n, div]) => {
            let tab = addElement("a", {
                id: `tab-${n}`,

                textContent: `${this.hasAttribute("numbered") ?
                    `${n}: ` : ""}${div.getAttribute("name")}`,

                onclick: () => div.hasAttribute("disabled") ?
                    {} : div.classList.contains("open") ?
                        this.minimize() : this.openTab(n),
            });

            // Handle disabled tabs.
            if (div.hasAttribute("disabled"))
                tab.classList.add("disabled");

            this.header.appendChild(tab);
            this.wrapper.appendChild(div);
            this.divs.push([tab, div]);
        });

        // Set default tab.
        if (this.open)
            this.openTab(this.getTab(this.getAttribute("open")));

        this.shadowRoot.append(style, this.wrapper);
    }

    /** Returns the index of a tab given its name attribute. */
    getTab(name) {
        if (!name) return 0;
        return this.divs.findIndex(([_, div]) => div.getAttribute("name") == name);
    }

    /** Minimize the tab menu to show only the header. */
    minimize() {
        this.header.classList.add("minimized");
        this.divs.forEach(([tab, div]) => {
            tab.classList.remove("open");
            div.classList.remove("open");
        });
    }

    /** Open a tab given its index. */
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

    /** Handle the user-defined or default background color. */
    #parseBackgroundColor() {
        const DEFAULT_BG_COLOR = "rgba(200, 200, 200, 1)";

        // Match numbers within the instance's background color or the default.
        const regex = /[\d\.]+/g
        const match = this.style.backgroundColor.match(regex) || DEFAULT_BG_COLOR.match(regex);

        // Separate RGB and alpha values.
        const bgColorParts = match ? match.map(Number) : DEFAULT_BG_COLOR;
        const alpha = bgColorParts.length > 3 ? bgColorParts.pop() : 1;

        // Create background color and inactive background color.
        const bgColor = `rgba(${bgColorParts.join(", ")}, ${alpha})`;
        const inactiveBgColor = `rgba(${bgColorParts.join(", ")}, ${Math.max(0, alpha - 0.2)})`;

        return [bgColor, inactiveBgColor];
    }
}

customElements.define("tab-menu", TabMenu);
