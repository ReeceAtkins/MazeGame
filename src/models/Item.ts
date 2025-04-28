export namespace Item {
    export enum ItemType {
        None = "None",
        Blank = "Blank",
        Lantern = "Lantern",
        Gloves = "Gloves",
        Chainsaw = "Chainsaw",
        Gasoline = "Gasoline"
    }

    /**
    * Gets all collectibles in enum ItemType, (everything except None and Blank).
    * @returns An array of collectible items.
    */
    export function getCollectibleItems(): ItemType[] {
        return Object.values(ItemType).filter(
            item => item !== ItemType.None && item !== ItemType.Blank
        );
    }
}