import type { FC } from 'react';

import type { PersonResponse } from '@hikka/api';

import MaterialSymbolsImageNotSupportedOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsImageNotSupportedOutlineRounded';

type Props = {
    person: Pick<PersonResponse, 'name_native' | 'name_en' | 'name_ua'>;
};

const PersonPlaceholder: FC<Props> = ({ person }) => {
    const name = (
        person.name_native ||
        person.name_en ||
        person.name_ua ||
        ''
    ).trim();
    const glyph = Array.from(name)[0]?.toLocaleUpperCase();

    if (!glyph) {
        return (
            <MaterialSymbolsImageNotSupportedOutlineRounded className="text-4xl text-muted-foreground" />
        );
    }

    return (
        <>
            <span
                aria-hidden
                className="select-none font-serif text-[45cqw] text-muted-foreground leading-none"
            >
                {glyph}
            </span>
            {person.name_native && (
                <span
                    aria-hidden
                    className="absolute inset-x-2 bottom-3 @[10rem]:block hidden truncate text-center text-muted-foreground/70 text-xs"
                >
                    {person.name_native}
                </span>
            )}
        </>
    );
};

export default PersonPlaceholder;
