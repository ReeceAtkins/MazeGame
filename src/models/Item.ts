export namespace Item {
    export enum ItemType {
        Path = "Path",
        Blank = "Blank",
        Lantern = "Lantern",
        Gloves = "Gloves",
        Chainsaw = "Chainsaw",
        Gasoline = "Gasoline"
    }

    /**
    * Gets all collectibles in enum ItemType, (everything except Path and Blank).
    * @returns An array of collectible items.
    */
    export function getCollectibleItems(): ItemType[] {
        return Object.values(ItemType).filter(
            (item): item is ItemType => item !== ItemType.Path && item !== ItemType.Blank
        );
    }
}