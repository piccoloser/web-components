import { addElement } from "./helpers.js";

class TabMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.divs = [];
        this.wrapper = addElement("div", { classList: "wrapper" });
        this.header = addElement("header", { classList: "tabs" });
        const style = addElement("style", {
            textContent: `
                a[class^="tab-"] {
                    padding: .25rem .5rem;border-radius: 3px 3px 0 0;
                    background-color: var(--tab-inactive-bg-color, #999);
                    color: var(--tab-inactive-color, currentColor);
                    cursor: pointer;user-select: none;
                }

                a[class^="tab-"]:hover {
                    background-color: var(--tab-menu-bg-color, #ccc);
                    color: var(--tab-color, currentColor);
                }

                a[class^="tab-"].open {
                    background-color: var(--tab-menu-bg-color, #ccc);
                    color: var(--tab-color, currentColor);
                }

                .tabs {
                    display: flex;gap: .25rem;padding: 0 .25rem;
                    border-bottom: solid 1px var(--tab-menu-bg-color, #ccc);
                    color: var(--tab-color, currentColor);
                }

                .tabs.minimized {
                    border-bottom: solid 1px var(--tab-inactive-bg-color, #999);
                }

                .wrapper {
                    display: flex;flex-direction: column;
                    margin: 1rem 0;
                }

                .wrapper>div:not(:first-child) {
                    display: none;
                    padding: 1rem;box-sizing: border-box;
                    background-color: var(--tab-menu-bg-color, #ccc);
                    color: var(--tab-color, currentColor);
                }
                .wrapper>div:not(:first-child).open { display: block; }
                .wrapper .disabled { opacity: .25; cursor: not-allowed; }
            `,
        });

        this.wrapper.appendChild(this.header);
        this.shadowRoot.append(style, this.wrapper);
    }

    connectedCallback() {
        // Add tabs to header.
        Object.entries(this.children).forEach(item => {
            let [n, div] = item;
            let tab = addElement("a", {
                classList: `tab-${n}`,
                textContent: this.tabName(item),
                onclick: () => div.hasAttribute("disabled") ?
                    0 : div.classList.contains("open") ?
                        this.minimize() : this.openTab(n),
            });

            // Handle disabled tabs.
            if (div.hasAttribute("disabled")) tab.classList.add("disabled");

            this.header.appendChild(tab);
            this.wrapper.appendChild(div);
            this.divs.push([tab, div]);
        });

        // Set default tab.
        if (!this.hasAttribute("closed"))
            this.openTab(this.tabIndex(this.getAttribute("open")));
    }

    /** Returns the index of a tab given its name attribute. */
    tabIndex = name => name ? this.divs.findIndex(([_, div]) => div.getAttribute("name") == name) : 0;

    /** Minimize the tab menu to show only the header. */
    minimize() {
        this.header.classList.add("minimized");
        this.divs.forEach(item => item.map(i => i.classList.remove("open")));
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

    tabName(tabDetails) {
        let [index, tab] = tabDetails;
        let sep = this.getAttribute("sep") || ": ";

        index = parseInt(index);

        if (this.hasAttribute("numbered")) index += 1;
        else index = sep = "";

        return `${index}${sep}${tab.getAttribute("name")}`;
    }
}

customElements.define("tab-menu", TabMenu);
