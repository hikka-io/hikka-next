import { createFileRoute } from '@tanstack/react-router';

import {
    navGroupLabelClassName,
    navRowClassName,
} from '@/features/app-shell/nav-styles';
import { PROFILE_MENU } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

export const Route = createFileRoute('/_pages/harness-profile-menu')({
    component: HarnessProfileMenu,
});

function HarnessProfileMenu() {
    const items = PROFILE_MENU.map((item) => ({
        ...item,
        url: item.url.replace('{username}', 'KasTash'),
    }));

    return (
        <div className="flex max-w-80 flex-col gap-0.5 p-3">
            <span className={navGroupLabelClassName}>Профіль</span>
            {items.map((item) => (
                <Link
                    key={item.slug}
                    to={item.url}
                    search={item.search}
                    className={navRowClassName}
                >
                    {item.icon && <item.icon />}
                    <span>{item.title_ua}</span>
                </Link>
            ))}
        </div>
    );
}
