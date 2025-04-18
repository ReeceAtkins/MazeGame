import { Direction } from "./Direction";
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
    move(direction) {
        switch (direction) {
            case Direction.Up:
                this.y--;
                break;
            case Direction.Down:
                this.y++;
                break;
            case Direction.Left:
                this.x--;
                break;
            case Direction.Right:
                this.x++;
                break;
        }
    }
}
