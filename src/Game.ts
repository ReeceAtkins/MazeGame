// Import enums ItemType and Direction, and Player
import { ItemType } from "./ItemType";
import { Direction } from "./Direction";
import { Player } from "./Player";


export class Game {
    grid: ItemType[][];
    player!: Player;

    constructor() {
        this.grid = [];
        this.createBoard();
        this.setPlayer();
    }

    /**
     * Creates a random jagged 2D array used for the grid. Places one of each item randomly,
     * except none. Places the player at a random valid location.
     */
    createBoard(): void {
        const maxRows = Math.floor(Math.random() * 10) + 5;
        const maxColumns = Math.floor(Math.random() * 10) + 5;

        // Initialize 2D array with ItemType None
        this.grid = Array.from({ length: maxRows}, () =>
            Array.from({ length: Math.floor(Math.random() * maxColumns) + 1}, () => ItemType.None)
        );

        const collectibleItems = this.getCollectibleItems();

        // Randomly places each item within the grid
        collectibleItems.forEach(item => {
            while (true) {
                const row = Math.floor(Math.random() * this.grid.length);
                const col = Math.floor(Math.random() * this.grid[row].length);
                
                if (this.grid[row][col] === ItemType.None) {
                    this.grid[row][col] = item;
                    break;
                }
            }
        });
    }

    /**
     * Places the player at a random valid location.
     */
    setPlayer(): void {
        while (true) {
            const y = Math.floor(Math.random() * this.grid.length);
            const x = Math.floor(Math.random() * this.grid[y].length);

            if (this.grid[y][x] === ItemType.None) {
                this.player = new Player(x, y);
                break;
            }
        }
    }

    /**
     * Checks if a move in the given direction is within grid bounds.
     * @param direction The direction to move in.
     * @returns True if the move is valid.
     */
    isValidMove(direction: Direction): boolean {
        let testX = this.player.x;
        let testY = this.player.y;

        switch (direction) {
            case Direction.Up:
                testY--;
                break;
            case Direction.Down:
                testY++;
                break;
            case Direction.Left:
                testX--;
                break;
            case Direction.Right:
                testX++;
                break;
        }

        return (testY >= 0 && testY < this.grid.length && testX >= 0 && testX < this.grid[testY].length);
    }

    /**
    * Moves the player if the move is valid and collects any uncollected items in new cell.
    * @param direction The direction to move.
    */
    move(direction: Direction): void {
        if (this.isValidMove(direction)) {
            switch (direction) {
                case Direction.Up:
                    this.player.y--;
                    break;
                case Direction.Down:
                    this.player.y++;
                    break;
                case Direction.Left:
                    this.player.x--;
                    break;
                case Direction.Right:
                    this.player.x++;
                    break;
            }
            this.checkForItem();
        }
    }

    /**
     * Checks if the player's new current location contains a new item and adds it to player inventory.
     */
    checkForItem(): void {
        const currentCellItem = this.grid[this.player.y][this.player.x];

        if (currentCellItem !== ItemType.None && !this.player.inventory.has(currentCellItem)) {
            this.player.collectItem(currentCellItem);
            this.grid[this.player.y][this.player.x] = ItemType.None;
        }
    }

    /**
     * Checks if the player has collected all collectible items.
     * @returns True if the player has collected all items.
     */
    winCondition(): boolean {
        const collectibleItems =  this.getCollectibleItems();
        return collectibleItems.every(item => this.player.inventory.has(item));
    }

    /**
     * Gets all collecitlbe ItemTypes.
     * @returns An array of collectible items.
     */
    getCollectibleItems(): ItemType[] {
        return Object.values(ItemType).filter(item => item !== ItemType.None);
    }
}