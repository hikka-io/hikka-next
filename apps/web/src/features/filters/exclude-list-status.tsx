import type { FC } from 'react';

import { ListX } from 'lucide-react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

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
import { catalogExcludeKey } from '@/utils/cookies';
import { READ_STATUS, WATCH_STATUS } from '@/utils/labels/enum-labels';
import { useRouteSearch } from '@/utils/navigation';
import type { AnimeSearch } from '@/utils/search-schemas';

import { filterPresetFormOptions } from './presets/filter-preset-form';
import { useChangeParam } from './use-change-param';

type Props = {
    contentType: MainContentTypeEnum;
};

const ExcludeListStatus: FC<Props> = ({ contentType }) => {
    const { user } = useSession();
    const { hide_listed } = useRouteSearch<Pick<AnimeSearch, 'hide_listed'>>();
    const handleChangeParam = useChangeParam();

    const key = catalogExcludeKey(contentType);
    const stored = useUiPreferences((prefs) => prefs.filters[key]);
    const setFilter = useUiPreferences((prefs) => prefs.setFilter);

    if (!user) return null;

    const isAnime = contentType === ContentTypeEnum.ANIME;
    const statuses = isAnime ? WATCH_STATUS : READ_STATUS;
    const icons: Record<string, FC<{ className?: string }>> = isAnime
        ? WATCH_STATUS_ICONS
        : READ_STATUS_ICONS;

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
                    value={stored ?? Object.keys(statuses)}
                    onValueChange={(value) => setFilter(key, value)}
                    options={Object.entries(statuses).map(
                        ([value, { title_ua }]) => ({ value, label: title_ua }),
                    )}
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
                                {Object.entries(statuses).map(
                                    ([status, { title_ua }]) => {
                                        const Icon = icons[status];

                                        return (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                                label={title_ua}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <Icon className="size-4 shrink-0" />
                                                    {title_ua}
                                                </span>
                                            </SelectItem>
                                        );
                                    },
                                )}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};

export const FormExcludeListStatus: FC<Partial<SwitchFieldProps>> = (props) => {
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

export default ExcludeListStatus;
