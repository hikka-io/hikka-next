import type { FC } from 'react';

import { ChevronsUpDown, LockIcon } from 'lucide-react';

import OptionSummary, { type ChoiceOption } from '@/components/option-summary';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';

type Props = {
    options: ChoiceOption[];
    value: string;
    onValueChange: (value: string) => void;
    'aria-labelledby'?: string;
    /** Locks the choice, with this reason it can no longer change. */
    lockedHint?: string;
};

/** A single choice from a list, shown as the chosen option's summary row. */
const OptionSelect: FC<Props> = ({
    options,
    value,
    onValueChange,
    'aria-labelledby': labelledBy,
    lockedHint,
}) => {
    const current = options.find((option) => option.value === value);

    if (!current) return null;

    if (lockedHint) {
        return (
            <OptionSummary
                option={current}
                hint={lockedHint}
                trailing={
                    <LockIcon className="size-4 shrink-0 text-muted-foreground" />
                }
            />
        );
    }

    return (
        <Select
            value={[value]}
            onValueChange={(next) => next[0] && onValueChange(next[0])}
        >
            <SelectTrigger
                asChild
                aria-labelledby={labelledBy}
                className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                <OptionSummary
                    option={current}
                    hint={current.description}
                    trailing={
                        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                    }
                    className="transition-colors hover:bg-accent/50"
                />
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        {options.map(
                            ({ value: optionValue, title, icon: Icon }) => (
                                <SelectItem
                                    key={optionValue}
                                    value={optionValue}
                                    label={title}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="size-4 text-muted-foreground" />
                                        {title}
                                    </span>
                                </SelectItem>
                            ),
                        )}
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default OptionSelect;
