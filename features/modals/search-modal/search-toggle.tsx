'use client';

import * as React from 'react';
import MaterialSymbolsAccountBox from '~icons/material-symbols/account-box';
import MaterialAnimatedImages from '~icons/material-symbols/animated-images';
import MaterialSymbolsFace3 from '~icons/material-symbols/face-3';
import MaterialSymbolsMenuBookRounded from '~icons/material-symbols/menu-book-rounded';
import MaterialSymbolsPalette from '~icons/material-symbols/palette';
import MaterialSymbolsPerson from '~icons/material-symbols/person';

import { buttonVariants } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { cn } from '@/utils/utils';

interface Props {
    type?: API.ContentType | 'user';
    setType: (type: API.ContentType) => void;
    disabled?: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
}

const SearchToggle = ({ type, setType, disabled, inputRef }: Props) => {
    const handleOnValueChange = (value: API.ContentType[]) => {
        value && setType(value[0]);
        inputRef.current?.focus();
    };

    return (
        <Select
            disabled={disabled}
            value={type ? [type] : undefined}
            onValueChange={handleOnValueChange}
        >
            <SelectTrigger
                className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'h-8',
                )}
                asChild
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        <SelectItem value="anime">
                            <div className="flex items-center gap-2">
                                <MaterialAnimatedImages className="!size-4" />{' '}
                                Аніме
                            </div>
                        </SelectItem>
                        <SelectItem value="manga">
                            <div className="flex items-center gap-2">
                                <MaterialSymbolsPalette className="!size-4" />{' '}
                                Манґа
                            </div>
                        </SelectItem>
                        <SelectItem value="novel">
                            <div className="flex items-center gap-2">
                                <MaterialSymbolsMenuBookRounded className="!size-4" />{' '}
                                Ранобе
                            </div>
                        </SelectItem>
                        <SelectItem value="character">
                            <div className="flex items-center gap-2">
                                <MaterialSymbolsFace3 className="!size-4" />{' '}
                                Персонаж
                            </div>
                        </SelectItem>
                        <SelectItem value="person">
                            <div className="flex items-center gap-2">
                                <MaterialSymbolsPerson className="!size-4" />{' '}
                                Людина
                            </div>
                        </SelectItem>
                        <SelectItem value="user">
                            <div className="flex items-center gap-2">
                                <MaterialSymbolsAccountBox className="!size-4" />{' '}
                                Користувач
                            </div>
                        </SelectItem>
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default SearchToggle;
