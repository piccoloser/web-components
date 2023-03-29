export class Color {
    #_rgba = "";
    constructor(r, g, b, a) {
        [this.r, this.g, this.b, this.a] = [r, g, b, a];
    }

    get rgba() {
        if (!this.#_rgba)
            this.#_rgba = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;

        return this.#_rgba;
    }

    get rgbArray() {
        return [this.r, this.g, this.b];
    }

    brightness(amount) {
        return new Color(...this.rgbArray.map(k => Math.max(0, k + amount)), this.a);
    }

    opacity(amount) {
        this.a += amount;
        if (this.a > 1) this.a = 1;
        if (this.a < 0) this.a = 0;

        return this;
    }

    static parseRGBA(value) {
        const regex = /[\d\.]+/g;
        const match = value.match(regex);

        let [r, g, b, a] = match ? match.map(Number) : [0, 0, 0, 0];
        if (!a) a = 1;

        return new Color(r, g, b, a);
    }

    static fromComputedStyle(element, alt = null, property = "background") {
        let value = getComputedStyle(element)[property];
        if (value == "none") value = alt;

        return this.parseRGBA(value);
    }

    static fromRGBA(value) {
        return this.parseRGBA(value);
    }
}