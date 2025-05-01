// Import enums ItemType and Direction, and Player
import { Item } from "./Item";
import { Direction } from "./Direction";
import { Player } from "./Player";


/**
 * Represents a Game object. Handles the creation a randomized grid (between a min and max size),
 * generates a random path, places collectible items and player, player movement within the grid,
 * and the win condition.
 */
export class Game {
    grid: Item.ItemType[][];
    player!: Player;

    private readonly GRID = {
        MIN_SIZE: 11,
        MAX_SIZE: 17,
        MIN_PATH_SIZE: 70
    };

    private readonly PATH = {
        DEPTH: 100,
        SPREAD_CHANCE: 0.4,
        CONTINUE_DIRECTION_CHANCE: 0.85,
        MAX_WIDTH: 1
    };

    private readonly MAX_ATTEMPTS = 500;

    constructor() {
        this.grid = [];
        this.createBoard();
        this.setPlayer();
    }

    /**
     * Initializes the game grid by creating a randomized maze and placing collectible items.
     * Throws an error if collectible item placement fails.
     */
    createBoard(): void {

        // Initialize 2D array with ItemType.Blank
        let maxRows = this.getRandomOddNumber(this.GRID.MIN_SIZE, this.GRID.MAX_SIZE);
        this.grid = Array.from({ length: maxRows }, () => {
            let maxColumns = this.getRandomOddNumber(this.GRID.MIN_SIZE, this.GRID.MAX_SIZE);
            return Array.from({ length: maxColumns}, () => Item.ItemType.Blank)
        });

        this.createPath();

        // Randomly places each item within the grid
        if (!this.placeCollectibleItems()) {
            throw new Error("Failed to place all collectible items on the board");
        }
    }

    /**
     * Attempts to create a randomized maze path through the grid.
     */
    private createPath(): void {
        let pathCreated = false;
        let attempts = 0;

        while (!pathCreated && attempts <= this.MAX_ATTEMPTS) {
            attempts++;

            if (attempts > 1) {
                this.resetGrid();
            }
            
            // Choose random starting point
            const startY = Math.floor(Math.random() * this.grid.length);
            const startX = Math.floor(Math.random() * this.grid[startY].length);

            if (this.grid[startY][startX] === Item.ItemType.Blank) {
                const pathSize = this.spreadPath(startY, startX, this.PATH.DEPTH);
                pathCreated = pathSize > Item.getCollectibleItems().length * 2 && pathSize > this.GRID.MIN_PATH_SIZE;
            }
            

            if (!pathCreated && attempts == this.MAX_ATTEMPTS) {
                console.log(`Path generation failed after ${attempts} attempts! Using last attempt.`);
            }
        }
        //console.log(`Path generation SUCCESS after ${attempts} attempt!`);
    }
    
    /**
    * Recursively carves out a path in the grid.
    * Enforces narrow passages, 1 cell width and occasional 2 cell width.
    * @param y - Current Y position.
    * @param x - Current X position.
    * @param remaining - Number of steps remaining.
    * @param lastDirection - The previous move direction .
    * @returns The number of cells the path created from this point.
    */
    private spreadPath(y: number, x: number, remaining: number, lastDirection?: Direction.DirectionType): number {
        if (remaining <= 0 ||
            y < 0 || y >= this.grid.length ||
            x < 0 || x >= this.grid[y].length ||
            this.grid[y][x] !== Item.ItemType.Blank
        ) return 0;

        this.grid[y][x] = Item.ItemType.None;
        let pathSize = 1;

        // Try continuing in last direction first
        if (lastDirection && Math.random() < this.PATH.CONTINUE_DIRECTION_CHANCE) {
            pathSize += this.tryDirection(y, x, remaining, lastDirection);
        }

        // Try other directions
        const directions = Direction.getShuffleDirections();
        for (const dir of directions) {
            if (dir === lastDirection || dir === Direction.getOppositeDirection(dir)) continue;

            if (Math.random() < this.PATH.SPREAD_CHANCE) {
                const [dy, dx] = Direction.DirectionOffsets[dir];
                const ny = y + dy;
                const nx = this.calculateNewX(y, x, ny, dx);

                if (ny >= 0 && ny < this.grid.length && 
                    nx >= 0 && nx < this.grid[ny].length && 
                    this.countAdjacentPathCells(ny, nx) <= this.PATH.MAX_WIDTH) {

                    const moved = this.tryDirection(y, x, remaining, dir);
                    if (moved > 0) {
                        pathSize += moved;
                    }
                }
            }
        }
        return pathSize;
    }

    /**
     * Attempts to continue the path by moving one cell in the given direction.
     * Delegates to spreadPath() if the move is valid for path extension.
     * @param y Current Y position.
     * @param x Current X position.
     * @param remaining Number of steps remaining.
     * @param dir Direction to attempt moving.
     * @returns Number of cells added to the path.
     */
    private tryDirection(y: number, x: number, remaining: number, dir: Direction.DirectionType): number {
        const [dy, dx] = Direction.DirectionOffsets[dir];

        const ny = y + dy;
        if (ny < 0 || ny >= this.grid.length) return 0;
    
        const nx = this.calculateNewX(y, x, ny, dx);
        if (nx < 0 || nx >= this.grid[ny].length) return 0;

        if (nx >= 0 && nx < this.grid[ny].length) {
            return this.spreadPath(ny, nx, remaining - 1, dir);
        }
        return 0;
    }

    /**
     * Counts the number of adjacent cells with ItemType None around a given position.
     * @param y The Y position.
     * @param x The X position.
     * @returns The number of adjacent ItemType.None cells.
     */
    private countAdjacentPathCells(y: number, x: number): number {
        let count = 0;

        for (const [dy, dx] of Object.values(Direction.DirectionOffsets)) {
            const ny = y + dy;
            const nx = x + dx;

            if (ny >= 0 && ny < this.grid.length && 
                nx >= 0 && nx < this.grid[ny].length && 
                this.grid[ny][nx] === Item.ItemType.None) {
                count++;
            }
        }
        return count;
    }

    /**
     * Calculates the correct x-coordinate when moving between rows of potentially different lengths.
     * @param originalY The original Y position.
     * @param originalX The original X position.
     * @param ny The target row index to move to.
     * @param dx The x-coordinate to move in.
     * @returns The adjusted X position in the new row, or -1 if out of bounds.
     */
    private calculateNewX(originalY: number, originalX: number, ny: number, dx: number): number {
        if (ny < 0 || ny >= this.grid.length) {
            return -1;
        }
    
        const currentRow = this.grid[originalY];
        const newRow = this.grid[ny];
        const centerOffset = originalX - Math.floor(currentRow.length / 2);
      
        return Math.floor(newRow.length / 2) + centerOffset + dx;
    }

    /**
     * Checks if a move in the given direction is within grid bounds and not on Blank.
     * @param direction The direction to move in.
     * @returns True if the move is valid.
     */
    isValidMove(direction: Direction.DirectionType): boolean {
        const [dy, dx] = Direction.DirectionOffsets[direction]
        const ny = this.player.y + dy;

        if (ny < 0 || ny >= this.grid.length) return false;

        const nx = this.calculateNewX(this.player.y, this.player.x, ny, dx);

        return (nx >= 0 && 
                nx < this.grid[ny].length) &&
                this.grid[ny][nx] !== Item.ItemType.Blank;
    }

    /**
    * Moves the player if the move is valid and collects any uncollected items in new cell.
    * @param direction The direction to move.
    */
    move(direction: Direction.DirectionType): void {
        if (this.isValidMove(direction)) {
            const [dy, dx] = Direction.DirectionOffsets[direction];
            const ny = this.player.y + dy;
            const nx = this.calculateNewX(this.player.y, this.player.x, ny, dx);

            this.player.y = ny;
            this.player.x = nx;

            this.checkForItem();

            if (this.winCondition()) {
                console.log("**** WIN CONDITION ****");
                console.log("          -_-          ");
                console.log("I suppose you win for now...");
            }
        }
        else {
            console.log(`MOVED FAILD! Cannot move ${direction} from y = ${this.player.y}, x = ${this.player.x}`)
        }
    }

    /**
     * Checks if the player's new current location contains a new item and adds it to their inventory.
     */
    checkForItem(): void {
        const currentCellItem = this.grid[this.player.y][this.player.x];

        if (currentCellItem !== Item.ItemType.None && !this.player.inventory.has(currentCellItem)) {
            this.player.collectItem(currentCellItem);
            console.log(`Collected: ${currentCellItem}`)
            this.grid[this.player.y][this.player.x] = Item.ItemType.None;
        }
    }

    /**
     * Checks if the player has collected all collectible items.
     * @returns True if the player has collected all items.
     */
    winCondition(): boolean {
        const collectibleItems =  Item.getCollectibleItems();
        return collectibleItems.every(item => this.player.inventory.has(item));
    }

    /**
     * Places all collectible items randomly throughout the grid.
     * @returns True if all collectible items were placed.
     */
    private placeCollectibleItems(): boolean {
        const collectibleItems = Item.getCollectibleItems();
        const availableCells = this.getNoneCells();

        if (availableCells.length < collectibleItems.length) {
            return false;
        }

        for (let i = 0; i < collectibleItems.length; i++) {
            const [y, x] = availableCells[i];
            this.grid[y][x] = collectibleItems[i];
        }

        return true;
    }

    /**
     * Places the player at a random valid location within grid.
     */
    private setPlayer(): void {
        const availableCells = this.getNoneCells();

        if (availableCells.length === 0) {
            throw new Error("No valid starting positions for player");
        }

        const [y, x] = availableCells[0];
        this.player = new Player(x, y);
    }

    /**
    * Gets a random odd number between given min and max.
    * @param min The minimum number.
    * @param max The maximum number.
    * @returns A random odd number between min and max
    */
    private getRandomOddNumber(min: number, max: number): number {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        return num % 2 === 0 ? num + 1 : num;
    }

    /**
     * Gets all available spots (ItemType.None) and shuffles them
     * @returns Shuffled array of [y, x] coordinates for available spots
     */
    private getNoneCells(): [number, number][]{
        const availableCells: [number, number][] = [];

        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === Item.ItemType.None) {
                    availableCells.push([y, x]);
                }
            }
        }

        // Shuffle using Fisher-Yates algorithm
        for (let i = availableCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
        }

        return availableCells;
    }

    /**
     * Resets every cell within the grid back to ItemType.Blank.
     */
    private resetGrid(): void {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === Item.ItemType.None) {
                    this.grid[y][x] = Item.ItemType.Blank;
                }
            }
        }
    }
}