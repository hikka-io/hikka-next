import { type FC, useEffect, useRef, useSyncExternalStore } from 'react';

import { onlineManager } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import { NETWORK_ERROR_MESSAGE } from '@hikka/core';

import { OFFLINE_TOAST_ID, setOfflineToastShown } from '@/utils/offline-toast';

const BACK_ONLINE = 'З’єднання відновлено';
// A tunnel or an elevator flips connectivity for a moment; the warning waits this long.
const OFFLINE_DELAY_MS = 1500;
// sonner-native has no persistent toast: it gets a day and is dismissed by id.
const PERSISTENT_MS = 24 * 60 * 60 * 1000;

const subscribe = (onChange: () => void) => onlineManager.subscribe(onChange);
const isOnline = () => onlineManager.isOnline();

const OfflineNotice: FC = () => {
    const online = useSyncExternalStore(subscribe, isOnline, isOnline);
    const shown = useRef(false);

    useEffect(() => {
        if (!online) {
            const timer = setTimeout(() => {
                shown.current = true;
                setOfflineToastShown(true);
                toast.warning(NETWORK_ERROR_MESSAGE, {
                    id: OFFLINE_TOAST_ID,
                    duration: PERSISTENT_MS,
                });
            }, OFFLINE_DELAY_MS);

            return () => clearTimeout(timer);
        }

        if (shown.current) {
            shown.current = false;
            setOfflineToastShown(false);
            toast.dismiss(OFFLINE_TOAST_ID);
            toast.success(BACK_ONLINE);
        }
    }, [online]);

    return null;
};

export default OfflineNotice;
