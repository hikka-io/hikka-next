import { XIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

import MaterialSymbolsAddRounded from '../icons/material-symbols/MaterialSymbolsAddRounded';
import { Badge } from './badge';
import { Button } from './button';
import { Input, InputProps } from './input';

type InputTagsProps = InputProps & {
    value: string[];
    onChange: (value: string[]) => void;
    disableKeys?: boolean;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
    ({ value, onChange, disableKeys, disabled, ...props }, ref) => {
        const [pendingDataPoint, setPendingDataPoint] = useState('');

        const addPendingDataPoint = () => {
            if (pendingDataPoint) {
                const newDataPoints = new Set([
                    ...value,
                    pendingDataPoint.toLowerCase(),
                ]);
                onChange(Array.from(newDataPoints));
                setPendingDataPoint('');
            }
        };

        return (
            <>
                {value.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 overflow-y-auto rounded-md">
                        {value.map((item, idx) => (
                            <Badge key={idx} variant="secondary">
                                {item}
                                <button
                                    type="button"
                                    className="ml-2 w-3"
                                    onClick={() => {
                                        onChange(
                                            value.filter((i) => i !== item),
                                        );
                                    }}
                                >
                                    <XIcon className="w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
                <div className="flex gap-2">
                    <Input
                        value={pendingDataPoint}
                        onChange={(e) => setPendingDataPoint(e.target.value)}
                        onKeyDown={(e) => {
                            if (disableKeys) return;
                            if (pendingDataPoint.length >= 16)
                                e.preventDefault();

                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addPendingDataPoint();
                            } else if (e.key === ',' || e.key === ' ') {
                                e.preventDefault();
                                addPendingDataPoint();
                            }
                        }}
                        className="flex-1 h-10"
                        disabled={disabled}
                        {...props}
                        ref={ref}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon-md"
                        disabled={disabled}
                        onClick={addPendingDataPoint}
                    >
                        <MaterialSymbolsAddRounded />
                    </Button>
                </div>
            </>
        );
    },
);
