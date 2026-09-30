import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import {
    Accessibility,
    AutoScroller,
    Cursor,
    DragDropManager,
    Draggable,
    Feedback,
    KeyboardSensor,
    PointerSensor,
    PreventSelection,
} from '@dnd-kit/dom';
import { afterEach, describe, expect, it } from 'vitest';

import { createDragDropManager } from './drag-drop-manager';

const GLOBALS_CSS = join(import.meta.dirname, '../globals.css');
const START = '/* biome-ignore-start lint/complexity/noImportantStyles';
const END = '/* biome-ignore-end lint/complexity/noImportantStyles';

const normalize = (css: string) =>
    css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replaceAll('"', "'")
        .replace(/\s+/g, '');

function libraryFeedbackStyles() {
    const source = readFileSync(
        createRequire(import.meta.url).resolve('@dnd-kit/dom'),
        'utf8',
    );
    const constants = new Map<string, string>();
    for (const [, name, quoted, template] of source.matchAll(
        /^var ([A-Z_0-9]+) = (?:"([^"]*)"|`([^`]*)`);$/gm,
    )) {
        constants.set(name, quoted ?? template);
    }
    const resolve = (text: string): string =>
        text.replace(/\$\{([A-Z_0-9]+)\}/g, (_, name: string) =>
            resolve(constants.get(name) ?? `\${${name}}`),
        );
    const rules = source.match(/var CSS_RULES = `([\s\S]*?)`\.replace/)?.[1];
    return rules ? resolve(rules) : '';
}

function shippedFeedbackStyles() {
    const css = readFileSync(GLOBALS_CSS, 'utf8');
    return css.slice(css.indexOf(START), css.indexOf(END));
}

describe('dnd-kit feedback styles', () => {
    it('match what @dnd-kit/dom would inject at drag time', () => {
        const library = normalize(libraryFeedbackStyles());

        expect(library).not.toBe('');
        expect(library).not.toContain('${');
        expect(normalize(shippedFeedbackStyles())).toBe(library);
    });
});

describe('createDragDropManager', () => {
    afterEach(() => {
        document.head.replaceChildren();
        document.body.replaceChildren();
    });

    const startDrag = (manager: DragDropManager) => {
        const element = document.createElement('div');
        document.body.append(element);
        const source = new Draggable(
            { id: 'source', element, register: false },
            manager,
        );
        manager.registry.register(source);
        manager.actions.start({ source, coordinates: { x: 0, y: 0 } });
    };

    it('keeps the default plugins and sensors', () => {
        const manager = createDragDropManager();

        for (const plugin of [
            Accessibility,
            AutoScroller,
            Cursor,
            Feedback,
            PreventSelection,
        ]) {
            expect(manager.registry.plugins.get(plugin)).toBeDefined();
        }
        expect(manager.registry.sensors.get(PointerSensor)).toBeDefined();
        expect(manager.registry.sensors.get(KeyboardSensor)).toBeDefined();
    });

    it('passes custom sensors and plugins through', () => {
        const manager = createDragDropManager({
            sensors: [PointerSensor],
            plugins: (defaults) =>
                defaults.filter((plugin) => plugin !== Accessibility),
        });

        expect(manager.registry.sensors.get(KeyboardSensor)).toBeUndefined();
        expect(manager.registry.plugins.get(Accessibility)).toBeUndefined();
        expect(manager.registry.plugins.get(Cursor)).toBeDefined();
    });

    it('injects no styles when a drag starts', () => {
        const library = new DragDropManager();
        startDrag(library);
        expect(document.head.querySelectorAll('style').length).toBeGreaterThan(
            0,
        );
        library.destroy();
        document.head.replaceChildren();

        const manager = createDragDropManager();
        startDrag(manager);
        expect(manager.dragOperation.status.initializing).toBe(true);
        expect(document.head.querySelectorAll('style')).toHaveLength(0);
        manager.destroy();
    });
});
