import { createContext } from 'react';

import type { TImageGroupElement } from '../editor/plate-types';

/**
 * The group around an image. A moved image keeps its identity, so Slate does
 * not re-render it with its new path; the group node changes on every move.
 */
export const ImageGroupContext = createContext<TImageGroupElement | null>(null);
