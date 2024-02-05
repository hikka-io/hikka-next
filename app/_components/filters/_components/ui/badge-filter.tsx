import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/app/_components/ui/tooltip';

interface Props {
    property: string;
    title: string;
    properties: Hikka.FilterProperty<string>;
    selected: string[];
    onParamChange: (key: string, value: string | string[]) => void;
}

const Component = ({ title, properties, selected, onParamChange, property }: Props) => {
    const handleFilterSelect = (value: string, data: string[]) => {
        const newData = [...data];

        if (!newData.includes(value)) {
            newData.push(value);
        } else {
            newData.splice(newData.indexOf(value), 1);
        }

        return newData;
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <Label className="text-muted-foreground">{title}</Label>
            <div className="flex flex-wrap gap-2">
                {Object.keys(properties).map((slug) => (
                    <Button
                        size="badge"
                        onClick={() =>
                            onParamChange(
                                property,
                                handleFilterSelect(slug, selected),
                            )
                        }
                        key={slug}
                        variant={
                            selected.includes(slug) ? 'default' : 'outline'
                        }
                    >
                        {properties[slug].title_ua}

                        {properties[slug].description && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                    <MaterialSymbolsInfoRounded className="text-xs opacity-30 transition duration-100 hover:opacity-100" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-sm">
                                        {properties[slug].description}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default Component;