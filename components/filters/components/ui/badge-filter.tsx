import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import P from '@/components/typography/p';

interface Props {
    property: string;
    title: string;
    properties: Hikka.FilterProperty<string>;
    selected: string[];
    onParamChange: (key: string, value: string | string[]) => void;
}

const Component = ({
    title,
    properties,
    selected,
    onParamChange,
    property,
}: Props) => {
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
        <div className="flex w-full flex-col gap-4">
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
                                <TooltipTrigger asChild>
                                    <div>
                                        <MaterialSymbolsInfoRounded className="text-xs opacity-30 transition duration-100 hover:opacity-100" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <P className="text-sm">
                                        {properties[slug].description}
                                    </P>
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
