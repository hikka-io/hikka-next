import H1 from '@/components/typography/h1';
import Small from '@/components/typography/small';

const PasswordConfirmHeader = () => {
    return (
        <div className="space-y-2 text-center">
            <H1 className="!text-3xl font-bold">🔓 Відновити пароль</H1>
            <Small className="text-muted-foreground">
                Будь ласка, введіть новий пароль.
            </Small>
        </div>
    );
};

export default PasswordConfirmHeader;
