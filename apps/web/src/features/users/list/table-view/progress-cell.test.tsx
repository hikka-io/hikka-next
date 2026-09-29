import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { TableCell } from '@/components/ui/table';

import ProgressCell from './progress-cell';

type Total = number | null | undefined;

const LegacyChaptersCell = ({
    chapters,
    total,
}: {
    chapters: number;
    total?: Total;
}) => (
    <TableCell className="w-20 text-center" align="center">
        {chapters} / {total || '?'}
    </TableCell>
);

const LegacyEpisodesCell = ({
    episodes,
    total,
}: {
    episodes: number;
    total?: Total;
}) => (
    <TableCell className="w-20 text-center max-md:pr-4!" align="center">
        {episodes} / {total || '?'}
    </TableCell>
);

const LegacyVolumesCell = ({
    volumes,
    total,
}: {
    volumes: number;
    total?: Total;
}) => (
    <TableCell className="w-20 text-center max-md:pr-4!" align="center">
        {volumes} / {total || '?'}
    </TableCell>
);

const html = (cell: ReactNode) =>
    renderToStaticMarkup(
        <table>
            <tbody>
                <tr>{cell}</tr>
            </tbody>
        </table>,
    );

describe.each([
    [3, 12],
    [0, null],
    [5, undefined],
    [7, 0],
] as const)('ProgressCell(%s, %s)', (value, total) => {
    it('matches the chapters cell', () => {
        expect(html(<ProgressCell value={value} total={total} />)).toBe(
            html(<LegacyChaptersCell chapters={value} total={total} />),
        );
    });

    it('matches the volumes cell', () => {
        expect(
            html(
                <ProgressCell
                    value={value}
                    total={total}
                    className="max-md:pr-4!"
                />,
            ),
        ).toBe(html(<LegacyVolumesCell volumes={value} total={total} />));
    });

    it('matches the episodes cell', () => {
        expect(
            html(
                <ProgressCell
                    value={value}
                    total={total}
                    className="max-md:pr-4!"
                />,
            ),
        ).toBe(html(<LegacyEpisodesCell episodes={value} total={total} />));
    });
});
