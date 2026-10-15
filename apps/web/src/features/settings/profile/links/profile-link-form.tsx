import type { FC } from 'react';

import type { UserLink } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import { Button } from '@/components/ui/button';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { userLinkTextSchema, userLinkUrlSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';

import { detectLinkIcon } from './detect-link-icon';

const formSchema = z.object({
    url: userLinkUrlSchema,
    text: userLinkTextSchema,
});

type Props = {
    link?: UserLink;
    onSubmit: (link: UserLink) => void;
    onDelete?: () => void;
};

const ProfileLinkForm: FC<Props> = ({ link, onSubmit, onDelete }) => {
    const form = useAppForm({
        defaultValues: {
            url: link?.url ?? '',
            text: link?.text ?? '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: ({ value }) => {
            const url = value.url.trim();

            onSubmit({
                icon: detectLinkIcon(url),
                url,
                text: value.text.trim() || null,
            });
        },
    });

    return (
        <form.AppForm>
            <form.Form className="flex flex-col gap-6">
                <form.AppField
                    name="url"
                    children={(field) => {
                        const Icon =
                            USER_LINK_ICONS[detectLinkIcon(field.state.value)];

                        return (
                            <field.TextField
                                label="Посилання"
                                placeholder="https://"
                                type="text"
                                inputMode="url"
                                autoCapitalize="none"
                                autoComplete="url"
                                spellCheck={false}
                                startIcon={<Icon />}
                            />
                        );
                    }}
                />
                <form.AppField
                    name="text"
                    children={(field) => (
                        <field.TextField
                            label="Підпис"
                            placeholder="Назва сервісу або домен"
                        />
                    )}
                />
                <ResponsiveModalFooter className="flex-row">
                    {onDelete && (
                        <Button
                            size="md"
                            variant="destructive"
                            onClick={onDelete}
                        >
                            Видалити
                        </Button>
                    )}
                    <SubmitButton size="md" className="flex-1 md:flex-none">
                        {link ? 'Зберегти' : 'Додати'}
                    </SubmitButton>
                </ResponsiveModalFooter>
            </form.Form>
        </form.AppForm>
    );
};

export default ProfileLinkForm;
