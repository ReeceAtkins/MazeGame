export namespace Direction {
    export enum DirectionType {
        Up,
        Down,
        Left,
        Right
    }

    /**
     * Maps the given direction to a [y, x] which matches the movement
     * that direction's y and x values will take
     */
    export const DirectionOffsets: Record<DirectionType, [number, number]> = {
        [DirectionType.Up]: [-1, 0],
        [DirectionType.Down]: [1, 0],
        [DirectionType.Left]: [0, -1],
        [DirectionType.Right]: [0, 1],
    };

    /**
     * Gets the opposite direction of a given direction.
     * @param direction Direction to find opposite of.
     * @returns The opposite of the given direction.
     */
    export function getOppositeDirection(direction: DirectionType): DirectionType {
        switch (direction) {
            case DirectionType.Up: return DirectionType.Down;
            case DirectionType.Down: return DirectionType.Up;
            case DirectionType.Left: return DirectionType.Right;
            case DirectionType.Right: return DirectionType.Left;
        }
    }

    /**
    * Creates and array of possible directions and shuffles them.
    * @returns Array of shuffled directions
    */
    export function getShuffleDirections(): DirectionType[] {
        const directions: DirectionType[] = [DirectionType.Up, DirectionType.Down, DirectionType.Left, DirectionType.Right];
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        return directions;
    }
}