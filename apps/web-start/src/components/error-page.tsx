import { ErrorComponent, type ErrorComponentProps } from '@tanstack/react-router';

const ErrorPage: React.FC<ErrorComponentProps> = (props) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <ErrorComponent {...props} />
        </div>
    );
};

export default ErrorPage;
