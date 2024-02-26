import { TTypoProps } from './type';

const typoH1 = ({ children, className, ...props }: TTypoProps) => {
    return (
        <h1
            className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl ${className}`}
            {...props}
        >
            {children}
        </h1>
    );
};

export default typoH1;
