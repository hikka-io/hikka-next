'use client';

import { CharacterResponse } from '@hikka/client';
import { useTitle } from '@hikka/react';
import * as React from 'react';

import ContentCard from '@/components/content-card/content-card';
import { Label } from '@/components/ui/label';

import { Link } from '@/utils/navigation';

interface Props {
    character: CharacterResponse;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const CharacterCard = ({ character, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;
    const title = useTitle(character);

    return (
        <Comp
            to={'/characters/' + character.slug}
            onClick={onClick}
            className="flex w-full items-center gap-4 text-left"
        >
            <div className="w-12">
                <ContentCard
                    containerClassName="rounded-(--base-radius)"
                    image={character.image}
                />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="font-bold">
                        {title}{' '}
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
