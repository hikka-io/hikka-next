import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import DividedList from './divided-list';

describe('DividedList', () => {
    it('renders nothing without items', () => {
        expect(
            renderToStaticMarkup(
                <DividedList>
                    {false}
                    {[]}
                </DividedList>,
            ),
        ).toBe('');
    });

    it('draws a divider above every item in one column', () => {
        const html = renderToStaticMarkup(
            <DividedList>
                <article>a</article>
                <article>b</article>
            </DividedList>,
        );

        expect(html).toContain('[&amp;&gt;*]:border-t');
        expect(html).not.toContain('md:grid-cols-2');
    });

    it('splits into two columns from md', () => {
        const html = renderToStaticMarkup(
            <DividedList columns={2}>
                <article>a</article>
            </DividedList>,
        );

        expect(html).toContain('md:grid-cols-2');
    });
});
