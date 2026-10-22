/** Posters a card can show; from md it shows as many as fit its width, then the tile. */
export const STRIP_PREVIEW_ITEMS = 5;

// On the rows that query it: containment would stop the card being a subgrid.
export const STRIP_CONTAINER_CLASS_NAME = '@container/collection';

export const STRIP_GRID_CLASS_NAME =
    'md:grid-cols-3 md:@max-sm/collection:gap-2 md:@lg/collection:grid-cols-4 md:@2xl/collection:grid-cols-5 md:@4xl/collection:grid-cols-6';

export const STRIP_POSTER_CLASS_NAMES = [
    '',
    '',
    'md:@max-lg/collection:hidden',
    'md:@max-2xl/collection:hidden',
    'md:@max-4xl/collection:hidden',
];

/** Hides the tile in a layout whose posters already show every entry. */
export const STRIP_TILE_LAYOUTS = [
    { shown: 2, hiddenClassName: 'md:@max-lg/collection:hidden' },
    {
        shown: 3,
        hiddenClassName: 'md:@lg/collection:@max-2xl/collection:hidden',
    },
    {
        shown: 4,
        hiddenClassName: 'md:@2xl/collection:@max-4xl/collection:hidden',
    },
    { shown: 5, hiddenClassName: 'max-md:hidden md:@4xl/collection:hidden' },
];

export const STRIP_META_CLASS_NAME = 'md:@max-sm/collection:hidden';

export const FOLLOW_LABEL_CLASS_NAME = '@max-xl/collection:hidden';

/** Card rows, placed explicitly so the grid's subgrid lines up neighbouring cards. */
export const CARD_ROWS = {
    author: 'row-start-1',
    title: 'row-start-2 mt-4',
    tags: 'row-start-3 mt-4',
    posters: 'row-start-4 mt-4',
    stats: 'row-start-5 mt-4',
};

/** A grid cell takes its row heights from the list, so neighbouring cards line up. */
export const GRID_CELL_CLASS_NAME = 'row-span-5 grid grid-rows-subgrid gap-y-0';
