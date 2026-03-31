'use client';

import { createContext, useContext } from 'react';

/**
 * Context for portal container elements. Used by modal components (Sheet, Dialog)
 * to provide their content element as a portal target, so that portaled children
 * (Select, Popover, etc.) render inside the modal's DOM tree and remain scrollable
 * under react-remove-scroll.
 *
 * When null (default), portals fall back to document.body.
 */
const PortalContainerContext = createContext<HTMLElement | null>(null);

export const PortalContainerProvider = PortalContainerContext.Provider;

export function usePortalContainer() {
    return useContext(PortalContainerContext);
}
