import {
    DragDropManager,
    type DragDropManagerInput,
    StyleInjector,
} from '@dnd-kit/dom';

export function createDragDropManager(input?: DragDropManagerInput) {
    const manager = new DragDropManager(input);
    // Per-drag page-wide styles restyle every element: the feedback styles live in globals.css, the grabbing cursor and user-select rules are dropped.
    manager.registry.plugins.get(StyleInjector)?.destroy();
    return manager;
}
