import { type FC, useId } from 'react';

import { LockIcon } from 'lucide-react';

import OptionIcon from '@/components/option-icon';
import OptionSummary, { type ChoiceOption } from '@/components/option-summary';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Props = {
    options: ChoiceOption[];
    value: string;
    onValueChange: (value: string) => void;
    'aria-labelledby'?: string;
    /** Shows only the current option, with this reason it can no longer change. */
    lockedHint?: string;
    className?: string;
};

/** A single choice laid out as cards with an icon, a title and an optional hint. */
const RadioCards: FC<Props> = ({
    options,
    value,
    onValueChange,
    'aria-labelledby': labelledBy,
    lockedHint,
    className,
}) => {
    // An editor may render the same picker twice (the side card and the phone drawer).
    const id = useId();

    if (lockedHint) {
        const current = options.find((option) => option.value === value);

        return current ? (
            <OptionSummary
                option={current}
                hint={lockedHint}
                trailing={
                    <LockIcon className="size-4 shrink-0 text-muted-foreground" />
                }
            />
        ) : null;
    }

    return (
        <RadioGroup
            aria-labelledby={labelledBy}
            value={value}
            onValueChange={(next) => onValueChange(next as string)}
            className={className}
        >
            {options.map((option) => (
                <FieldLabel
                    key={option.value}
                    htmlFor={`${id}-${option.value}`}
                >
                    <Field orientation="horizontal" className="gap-3">
                        <OptionIcon
                            icon={option.icon}
                            className="group-has-data-checked/field-label:bg-primary-foreground/15 group-has-data-checked/field-label:text-primary-foreground"
                        />
                        <FieldContent>
                            <FieldTitle>{option.title}</FieldTitle>
                            {option.description && (
                                <FieldDescription className="text-xs">
                                    {option.description}
                                </FieldDescription>
                            )}
                        </FieldContent>
                        <RadioGroupItem
                            value={option.value}
                            id={`${id}-${option.value}`}
                        />
                    </Field>
                </FieldLabel>
            ))}
        </RadioGroup>
    );
};

export default RadioCards;
