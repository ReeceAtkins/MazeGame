import { JSX } from 'react';
import { Item } from './Item'
import { GiLantern, GiChainsaw, GiGloves } from 'react-icons/gi';
import { PiGasCanFill } from "react-icons/pi";

export const itemIcons: Record<Item.ItemType, JSX.Element> = {
    [Item.ItemType.Lantern]: <GiLantern color="gold" size="90%" />,
    [Item.ItemType.Gloves]: <GiGloves color="lightgrey" size="90%" />,
    [Item.ItemType.Chainsaw]: <GiChainsaw color="darkgrey" size="90%" />,
    [Item.ItemType.Gasoline]: <PiGasCanFill color="red" size="90%" />,
    [Item.ItemType.Path]: <></>,
    [Item.ItemType.Blank]: <></>,
};