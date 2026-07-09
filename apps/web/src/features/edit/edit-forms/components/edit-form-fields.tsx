import EditDescription from './edit-description';
import EditGroup from './edit-group';
import NativeTitleWarning from './native-title-warning';

type Props = {
    params: Record<string, Hikka.EditParam[]>;
    groups: Record<string, string>;
    mode: 'view' | 'edit' | 'update';
    nativeTitleMissing: boolean;
    defaultOpen?: boolean;
};

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
}: Props) => {
    return (
        <div className="flex w-full flex-col gap-6">
            {Object.keys(params).map((group) => (
                <EditGroup
                    key={group}
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

            <EditDescription mode={mode === 'update' ? 'edit' : mode} />
        </div>
    );
};

export default EditFormFields;
