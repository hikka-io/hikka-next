'use client';

import Link from 'next/link';
import * as React from 'react';

import ContentCard from '@/components/content-card/content-card';
import { Label } from '@/components/ui/label';

interface Props {
    character: API.Character;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const CharacterCard = ({ character, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            href={'/characters/' + character.slug}
            onClick={onClick}
            className="flex w-full gap-4 text-left"
        >
            <div className="w-12 sm:w-16">
                <ContentCard poster={character.image} />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="font-bold">
                        {character.name_ua ||
                            character.name_en ||
                            character.name_ja}{' '}
                        <Label className="text-muted-foreground">
                            / {character.name_ja}
                        </Label>
                    </Label>
                </div>
            </div>
        </Comp>
    );
};

export default CharacterCard;
