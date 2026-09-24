import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import MDViewer from './md-viewer';

const render = (markdown: string, props: Record<string, unknown> = {}) =>
    renderToStaticMarkup(<MDViewer {...props}>{markdown}</MDViewer>);

describe('spoiler rendering', () => {
    it('renders the block form with the reveal button', () => {
        const html = render(':::spoiler\nsecret\n:::');

        expect(html).toContain('secret');
        expect(html).toContain('Спойлер');
    });

    it('renders the inline form inside the paragraph', () => {
        const html = render('a :spoiler[hidden] b');

        expect(html).toContain('hidden');
        expect(html).toMatch(/<p>[^<]*a\s*<span/);
    });

    it('never nests a block element inside a paragraph', () => {
        const html = render('a :spoiler[hidden] b');
        const paragraph = html.slice(html.indexOf('<p>'), html.indexOf('</p>'));

        expect(paragraph).not.toContain('<div');
    });

    it('blurs the inline form in preview mode', () => {
        const html = render('a :spoiler[hidden] b', { preview: true });

        expect(html).toContain('spoiler-blur-sm');
        expect(html).not.toContain('Показати спойлер');
    });

    it('keeps the text of an unknown directive', () => {
        const html = render('a :note[kept] b');

        expect(html).toContain('kept');
    });
});

describe('strikethrough', () => {
    it('renders GFM strikethrough', () => {
        expect(render('a ~~struck~~ b')).toContain('<del>struck</del>');
    });

    it('leaves a single tilde as text', () => {
        const html = render('~5 серій~');

        expect(html).not.toContain('<del>');
        expect(html).toContain('~5 серій~');
    });
});

describe('directives that are text', () => {
    it.each([
        ['Re:Zero is great', '<p>Re:Zero is great</p>'],
        ['plain :spoiler b', '<p>plain :spoiler b</p>'],
        ['see :note[kept] ok', '<p>see :note[kept] ok</p>'],
        ['::note[leaf]', '<p>::note[leaf]</p>'],
    ])('renders %j literally', (markdown, expected) => {
        expect(render(markdown)).toContain(expected);
    });
});
