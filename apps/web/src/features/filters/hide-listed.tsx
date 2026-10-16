import type { FC } from 'react';

import { ListX } from 'lucide-react';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadStatusEnum,
    type WatchStatusEnum,
} from '@hikka/api';

import {
    SwitchField,
    type SwitchFieldProps,
    useTypedAppFormContext,
} from '@/components/form';
import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSession } from '@/services/session';
import { useUiPreferences } from '@/services/ui-preferences-store';
import {
    catalogHideListedKey,
    catalogHideListedStatuses,
} from '@/utils/cookies';
import { READ_STATUS, WATCH_STATUS } from '@/utils/labels/enum-labels';
import { useRouteSearch } from '@/utils/navigation';
import type { AnimeSearch } from '@/utils/search-schemas';

import { filterPresetFormOptions } from './presets/filter-preset-form';
import { useChangeParam } from './use-change-param';

type Props = {
    contentType: MainContentTypeEnum;
};

const STATUS_OPTIONS = {
    watch: Object.entries(WATCH_STATUS).map(([value, { title_ua }]) => ({
        value,
        label: title_ua,
        Icon: WATCH_STATUS_ICONS[value as WatchStatusEnum],
    })),
    read: Object.entries(READ_STATUS).map(([value, { title_ua }]) => ({
        value,
        label: title_ua,
        Icon: READ_STATUS_ICONS[value as ReadStatusEnum],
    })),
};

const HideListed: FC<Props> = ({ contentType }) => {
    const { user } = useSession();
    const { hide_listed } = useRouteSearch<Pick<AnimeSearch, 'hide_listed'>>();
    const handleChangeParam = useChangeParam();
    const filters = useUiPreferences((prefs) => prefs.filters);
    const setFilter = useUiPreferences((prefs) => prefs.setFilter);

    if (!user) return null;

    const options =
        STATUS_OPTIONS[
            contentType === ContentTypeEnum.ANIME ? 'watch' : 'read'
        ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ListX className="size-4 shrink-0" />
                    <Label htmlFor="hide-listed">
                        Приховати тайтли з мого списку
                    </Label>
                </div>
                <Switch
                    id="hide-listed"
                    checked={Boolean(hide_listed)}
                    onCheckedChange={(checked) =>
                        handleChangeParam('hide_listed', checked)
                    }
                />
            </div>
            {hide_listed && (
                <Select
                    multiple
                    value={catalogHideListedStatuses(filters, contentType)}
                    onValueChange={(value) =>
                        setFilter(catalogHideListedKey(contentType), value)
                    }
                    options={options}
                >
                    <SelectTrigger size="md">
                        <SelectValue
                            maxDisplay={1}
                            placeholder="Виберіть статус..."
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {options.map(({ value, label, Icon }) => (
                                    <SelectItem
                                        key={value}
                                        value={value}
                                        label={label}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Icon className="size-4 shrink-0" />
                                            {label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};

export const FormHideListed: FC<Partial<SwitchFieldProps>> = (props) => {
    const form = useTypedAppFormContext(filterPresetFormOptions);
    const { user } = useSession();

    if (!user) return null;

    return (
        <form.AppField
            name="hide_listed"
            children={() => (
                <SwitchField
                    {...props}
                    label="Приховати тайтли з мого списку"
                />
            )}
        />
    );
};

export default HideListed;
