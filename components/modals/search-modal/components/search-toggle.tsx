'use client';

import * as React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props {
    type?: API.ContentType;
    setType: (type: API.ContentType) => void;
    disabled?: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
}

const SearchToggle = ({ type, setType, disabled, inputRef }: Props) => {
    const handleOnValueChange = (value: API.ContentType) => {
        value && setType(value);
        inputRef.current?.focus();
    };

    return (
        <ToggleGroup
            disabled={disabled}
            defaultValue="anime"
            type="single"
            size="badge"
            variant="default"
            value={type}
            onValueChange={handleOnValueChange}
        >
            <ToggleGroupItem value="anime">Аніме</ToggleGroupItem>
            <ToggleGroupItem value="character">Персонаж</ToggleGroupItem>
            <ToggleGroupItem value="person">Людина</ToggleGroupItem>
            <ToggleGroupItem value="user">Користувач</ToggleGroupItem>
        </ToggleGroup>
    );
};

export default SearchToggle;
