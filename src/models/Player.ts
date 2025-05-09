// Import enums ItemType and Direction
import { Item } from "./Item";

/**
 * Represents a player object for a 2D array. Manages the player's position,
 * inventory, and item collection.
 */
export class Player {
    x: number;
    y: number;
    inventory: Set<Item.ItemType>;

    /**
     * Initializes a Player with a starting position and an empty inventory.
     * @param startX The initial x-coordinate.
     * @param startY The initial y-coordinate.
     */
    constructor(startX: number, startY: number) {
        this.x = startX;
        this.y = startY;
        this.inventory = new Set<Item.ItemType>();
    }

    /**
     * Collects a given item if not already contained in inventory.
     * @param item The item to collect.
     */
    collectItem(item: Item.ItemType): void {
        if (!this.inventory.has(item)) {
            this.inventory.add(item);
        }
    }
}