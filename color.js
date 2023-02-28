export class Color {
    constructor(r, g, b, a) {
        [this.r, this.g, this.b, this.a] = [r, g, b, a];
    }

    get rgba() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }

    get rgbArray() {
        return Array.from("rgb").map(k => this[k]);
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

    static fromComputedStyle(element, alt = null, property = "background") {
        let value = getComputedStyle(element)[property];
        if (value == "none") value = alt;

        const regex = /[\d\.]+/g;
        const match = value.match(regex);

        let [r, g, b, a] = match ? match.map(Number) : [0, 0, 0, 0];
        if (!a) a = 1;

        return new Color(r, g, b, a);
    }
}