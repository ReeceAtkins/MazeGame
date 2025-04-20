// Import enums ItemType and Direction
import { ItemType } from "./ItemType";

/**
 * Represents a player object for a 2D array. Manages the player's position,
 * inventory, basic movement, and item collection.
 */
export class Player {
    x: number;
    y: number;
    inventory: Set<ItemType>;

    /**
     * Initializes a Player with a starting position and an empty inventory.
     * @param startX The initial x-coordinate.
     * @param startY The initial y-coordinate.
     */
    constructor(startX: number, startY: number) {
        this.x = startX;
        this.y = startY;
        this.inventory = new Set<ItemType>();
    }

    /**
     * Collects a given item if not already contained in inventory.
     * @param item The item to collect.
     */
    collectItem(item: ItemType): void {
        if(!this.inventory.has(item)) {
            this.inventory.add(item);
        }
    }
}