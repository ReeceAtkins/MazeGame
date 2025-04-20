export class Player {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.inventory = new Set();
    }
    collectItem(item) {
        if (!this.inventory.has(item)) {
            this.inventory.add(item);
        }
    }
}
