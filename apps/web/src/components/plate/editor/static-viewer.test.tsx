import { renderToStaticMarkup } from 'react-dom/server';

import type { Value } from 'platejs';
import { describe, expect, it } from 'vitest';

import { StaticKit } from './static-kit';
import { StaticViewer } from './static-viewer';

const VALUE: Value = [
    { type: 'p', children: [{ text: 'paragraph' }] },
    { type: 'h3', children: [{ text: 'heading' }] },
    { type: 'blockquote', children: [{ text: 'quote' }] },
];

const renderTags = () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<StaticViewer value={VALUE} />);

    return Array.from(
        container.querySelectorAll('[data-slate-node="element"]'),
        (element) =>
            `${element.getAttribute('data-slate-type')}:${element.tagName.toLowerCase()}`,
    );
};

describe('StaticViewer', () => {
    it('renders the same element tags on every render', () => {
        const expected = ['p:p', 'h3:h3', 'blockquote:blockquote'];

        expect(renderTags()).toEqual(expected);
        expect(renderTags()).toEqual(expected);
        expect(renderTags()).toEqual(expected);
    });

    it('leaves the shared plugin kit intact', () => {
        const keys = StaticKit.map((plugin) => plugin.key);

        renderTags();

        expect(keys).toContain('p');
        expect(StaticKit.map((plugin) => plugin.key)).toEqual(keys);
    });
});
