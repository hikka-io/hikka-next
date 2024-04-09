'use client';

import * as React from 'react';

import Link from 'next/link';

import EntryCard from '@/components/entry-card/entry-card';
import { Label } from '@/components/ui/label';

interface Props {
    person: API.Person;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    type?: 'link' | 'button';
}

const PersonCard = ({ person, onClick, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;

    return (
        <Comp
            href={'/people/' + person.slug}
            onClick={onClick}
            className="flex w-full gap-4 text-left"
        >
            <div className="w-12 sm:w-16">
                <EntryCard poster={person.image} />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="font-bold">
                        {person.name_ua || person.name_en || person.name_native}{' '}
                        <Label className="text-muted-foreground">
                            / {person.name_native}
                        </Label>
                    </Label>
                </div>
            </div>
        </Comp>
    );
};

export default PersonCard;
