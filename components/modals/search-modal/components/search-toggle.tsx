'use client';

import * as React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props {
    type?: API.ContentType;
    setType: (type: API.ContentType) => void;
    disabled?: boolean;
}

const SearchToggle = ({ type, setType, disabled }: Props) => {
    return (
        <ToggleGroup
            disabled={disabled}
            defaultValue="anime"
            type="single"
            size="badge"
            variant="default"
            value={type}
            onValueChange={(value: API.ContentType) => value && setType(value)}
        >
            <ToggleGroupItem value="anime">Аніме</ToggleGroupItem>
            <ToggleGroupItem value="character">Персонаж</ToggleGroupItem>
            <ToggleGroupItem value="person">Людина</ToggleGroupItem>
        </ToggleGroup>
    );
};

export default SearchToggle;
