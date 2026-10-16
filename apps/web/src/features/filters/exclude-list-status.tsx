import type { FC } from 'react';

import { ListX } from 'lucide-react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import {
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from '@/components/icons/list-status-icons';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSession } from '@/services/session';
import { useUiPreferences } from '@/services/ui-preferences-store';
import { catalogExcludeKey } from '@/utils/cookies';
import { READ_STATUS, WATCH_STATUS } from '@/utils/labels/enum-labels';

type Props = {
    contentType: MainContentTypeEnum;
};

const ExcludeListStatus: FC<Props> = ({ contentType }) => {
    const { user } = useSession();
    const key = catalogExcludeKey(contentType);
    const selected = useUiPreferences((prefs) => prefs.filters[key]);
    const setFilter = useUiPreferences((prefs) => prefs.setFilter);
    const clearFilter = useUiPreferences((prefs) => prefs.clearFilter);

    if (!user) return null;

    const isAnime = contentType === ContentTypeEnum.ANIME;
    const statuses = isAnime ? WATCH_STATUS : READ_STATUS;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ListX className="size-4 shrink-0" />
                    <Label htmlFor="exclude-list-status">
                        Приховати тайтли з мого списку
                    </Label>
                </div>
                <Switch
                    id="exclude-list-status"
                    checked={selected !== undefined}
                    onCheckedChange={(checked) =>
                        checked
                            ? setFilter(key, Object.keys(statuses))
                            : clearFilter(key)
                    }
                />
            </div>
            {selected && (
                <BadgeFilter
                    property={key}
                    properties={statuses}
                    icons={isAnime ? WATCH_STATUS_ICONS : READ_STATUS_ICONS}
                    selected={selected}
                    onParamChange={(_, value) =>
                        setFilter(key, value as string[])
                    }
                />
            )}
        </div>
    );
};

export default ExcludeListStatus;
