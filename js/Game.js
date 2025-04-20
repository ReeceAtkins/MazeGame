import { ItemType } from "./ItemType";
import { Direction } from "./Direction";
import { Player } from "./Player";
export class Game {
    constructor() {
        this.grid = [];
        this.createBoard();
        this.setPlayer();
    }
    createBoard() {
        const maxRows = Math.floor(Math.random() * 10) + 5;
        const maxColumns = Math.floor(Math.random() * 10) + 5;
        this.grid = Array.from({ length: maxRows }, () => Array.from({ length: Math.floor(Math.random() * maxColumns) + 1 }, () => ItemType.None));
        const collectibleItems = this.getCollectibleItems();
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
    setPlayer() {
        while (true) {
            const y = Math.floor(Math.random() * this.grid.length);
            const x = Math.floor(Math.random() * this.grid[y].length);
            if (this.grid[y][x] === ItemType.None) {
                this.player = new Player(x, y);
                break;
            }
        }
    }
    isValidMove(direction) {
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
    move(direction) {
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
    checkForItem() {
        const currentCellItem = this.grid[this.player.y][this.player.x];
        if (currentCellItem !== ItemType.None && !this.player.inventory.has(currentCellItem)) {
            this.player.collectItem(currentCellItem);
            this.grid[this.player.y][this.player.x] = ItemType.None;
        }
    }
    winCondition() {
        const collectibleItems = this.getCollectibleItems();
        return collectibleItems.every(item => this.player.inventory.has(item));
    }
    getCollectibleItems() {
        return Object.values(ItemType).filter(item => item !== ItemType.None);
    }
}
