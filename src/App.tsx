import { useState, useEffect } from 'react'
import './css/App.css'
import { Game } from './models/Game'
import { Item } from './models/Item'
import { Direction } from './models/Direction';
import { GiCheckMark, GiCrossMark } from 'react-icons/gi';
import { itemIcons } from './models/ItemIcons';


const DEBUG = false;
const VISIBILITY_RADIUS = 3;

function App() {
    // Render variables
	const [game, setGame] = useState(new Game());
	const [visibleGrid, setVisibleGrid] = useState(game.getVisibleGrid(VISIBILITY_RADIUS));
	const [forceUpdate, setForceUpdate] = useState(0);
    const [facing, setFacing] = useState<"left" | "right">("right");
    const [hasWon, setHasWon] = useState(false);

    
    // Keyboard input
	useEffect(() => {
		const handleKeyInput = (e: KeyboardEvent) => {
			switch(e.key) {
				case "ArrowUp": 
				case "w":
					movePlayer(Direction.DirectionType.Up);
					break;
				case "ArrowDown":
				case "s":
					movePlayer(Direction.DirectionType.Down);
					break;
				case "ArrowLeft":
				case "a":
                    setFacing("left");
					movePlayer(Direction.DirectionType.Left); 
					break;
				case "ArrowRight": 
				case "d":
                    setFacing("right");
					movePlayer(Direction.DirectionType.Right); 
					break;
                case "y":
                    if (hasWon) {
                        resetGame();
                    }
                    break;
				default:
					return;
			}
		}
        
		window.addEventListener("keydown", handleKeyInput);
		return () => window.removeEventListener("keydown", handleKeyInput);
	}, [hasWon]);

    // Player movement
	const movePlayer = (dir: Direction.DirectionType) => {
		const moved = game.move(dir);
		if (moved) {
			game.checkForItem();

			if (game.winCondition()) {
				console.log("**** WIN CONDITION TRUE ****");
				setHasWon(true);
			}

			setForceUpdate(prev => prev + 1);
			setVisibleGrid(game.getVisibleGrid(VISIBILITY_RADIUS));
		}
	};
    
    // Display's item overlay
    const ItemOverlay = () => {
        const collectibleItems = Item.getCollectibleItems();

        return (
            <div className="item-overlay">
                {collectibleItems.map((item) => {
                    const icon = itemIcons[item];
                    const hasItem = game.player.inventory.has(item);

                    return (
                        <div key={item} className="item-status">
                            <span className="item-icon">{icon}</span>
                            <span className="item-name">{item}</span>
                            {hasItem ? (
                                <GiCheckMark color="green" />
                            ) : (
                                <GiCrossMark color="red" />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Rerenders new game
    const resetGame = () => {
        const newGame = new Game(); // create a new game instance
        setGame(newGame);
        setVisibleGrid(newGame.getVisibleGrid(VISIBILITY_RADIUS));
        setHasWon(false);
        setForceUpdate(prev => prev + 1);
    };


    return (
        <div className="grid-container">
            <div className="maze-grid">
            <ItemOverlay />
            {hasWon && (
                <div className="win-overlay">
                <div className="win-message">
                    <h1>Congratulations! YOU WIN!</h1>
                    <p>Press <strong>Y</strong> to play again</p>
                </div>
                </div>
            )}

                {DEBUG ? (
                    // Debug view - show full grid without textures
                    game.grid.map((row, rowIndex) => (
                        <div className="maze-row" key={rowIndex}>
                            {row.map((cell, colIndex) => {

                                
                                const isBlank = cell === Item.ItemType.Blank;
                                const isNone = cell === Item.ItemType.Path;
                                const isPlayer = game.player.y === rowIndex && game.player.x === colIndex;

                                const display = isPlayer ? 'Player' 
                                : !isBlank && !isNone ? Item.ItemType[cell] 
                                : '';

                                let cellClass = `debug-maze-cell${isBlank ? ' blank-cell' : ''}`;
                                if (isPlayer) cellClass += ' debug-player-cell'

                                return (
                                    <div className={cellClass} key={colIndex}>
                                        {display}
                                    </div>
                                )
                            })}
                        </div>
                    ))
                ) : (
                    // Normal gameplay - show visible grid with player always centered
                    visibleGrid.map((row, rowIndex) => (
                        <div className="maze-row" key={rowIndex}>
                            {row.map((cell, colIndex) => {
                                const isBlank = cell === Item.ItemType.Blank;
                                const isPath = cell === Item.ItemType.Path;

                                // Centers player
                                const isPlayer = rowIndex === VISIBILITY_RADIUS && colIndex === VISIBILITY_RADIUS;

                                const display = isPlayer ? (<img src={`/src/assets/Bob-The-Blob-${facing}.png`} />) 
                                : itemIcons[cell as Item.ItemType] ?? '';

                                let cellClass = `maze-cell${isBlank ? ' blank-cell' : ''}`;
                                if (isPath) cellClass += ' path-cell'

                                return (
                                    <div className={cellClass} key={colIndex}>
                                        {display}
                                    </div>
                                )
                            })}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App
