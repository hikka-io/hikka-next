import { Button } from '@/components/ui/button';
import { SOCIAL_GROUP } from '@/features/app-shell';

const HomeHeaderActions = () =>
    SOCIAL_GROUP.map((social) => (
        <Button
            key={social.slug}
            variant="ghost"
            size="icon-md"
            className="text-muted-foreground [&_svg]:size-5"
            aria-label={social.title_ua}
            render={
                <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                />
            }
        >
            {social.icon && <social.icon />}
        </Button>
    ));

export default HomeHeaderActions;
