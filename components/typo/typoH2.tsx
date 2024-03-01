import {TTypoProps} from "./type";

const typoH2 = ({children, className, ...props}: TTypoProps) => {
    return (
        <h2 className={`scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${className}`} {...props}>
            {children}
        </h2>
    );
};

export default typoH2;
