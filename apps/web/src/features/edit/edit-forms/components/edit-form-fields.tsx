import { cn } from '@/utils/cn';

import EditDescription from './edit-description';
import EditGroup from './edit-group';
import NativeTitleWarning from './native-title-warning';

type Props = {
    params: Record<string, Hikka.EditParam[]>;
    groups: Record<string, string>;
    mode: 'view' | 'edit' | 'update';
    nativeTitleMissing: boolean;
    defaultOpen?: boolean;
    bleed?: boolean;
};

const BLEED = '-mx-4 rounded-none border-x-0 md:mx-0 md:rounded-lg md:border-x';

/**
 * Shared field body for the create and view/update edit forms: renders each
 * param group plus the description field. Must be rendered inside the form's
 * `<form.AppForm>` so the fields pick up the form context.
 */
const EditFormFields = ({
    params,
    groups,
    mode,
    nativeTitleMissing,
    defaultOpen = false,
    bleed = false,
}: Props) => {
    return (
        <div className="flex w-full flex-col gap-6">
            {Object.keys(params).map((group, index) => (
                <EditGroup
                    key={group}
                    className={cn(
                        index === 0 && 'backdrop-blur',
                        bleed && BLEED,
                    )}
                    title={groups[group]}
                    groupKey={group}
                    params={params[group]}
                    mode={mode}
                    defaultOpen={defaultOpen}
                    warning={
                        mode !== 'view' &&
                        group === 'title' &&
                        nativeTitleMissing && <NativeTitleWarning />
                    }
                />
            ))}

            <EditDescription
                mode={mode === 'update' ? 'edit' : mode}
                className={bleed ? BLEED : undefined}
            />
        </div>
    );
};

export default EditFormFields;
