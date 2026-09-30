import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import CharacterCounter from './character-counter';

const MAX = 2048;

const render = (length: number) =>
    renderToStaticMarkup(<CharacterCounter length={length} max={MAX} />);

describe('CharacterCounter', () => {
    it.each([0, MAX - 201])('stays hidden at %i characters', (length) => {
        expect(render(length)).toBe('');
    });

    it.each([MAX - 200, MAX])(
        'shows %i characters out of the limit',
        (length) => {
            const markup = render(length);

            expect(markup).toContain(`${length}/${MAX}`);
            expect(markup).toContain('text-muted-foreground');
            expect(markup).not.toContain('text-destructive');
        },
    );

    it('marks a length over the limit', () => {
        const markup = render(MAX + 1);

        expect(markup).toContain(`${MAX + 1}/${MAX}`);
        expect(markup).toContain('text-destructive');
    });
});
