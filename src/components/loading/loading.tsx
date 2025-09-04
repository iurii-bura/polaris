import type { FunctionComponent, ReactElement } from 'react';

type LoadingProps = {
    /**
     * The size of the loading spinner
     */
    readonly size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * Optional text to display below the spinner
     */
    readonly text?: string;
    /**
     * Additional CSS classes to apply to the container
     */
    readonly className?: string;
};

/**
 * Loading component that wraps DaisyUI loading spinner
 * This provides a consistent loading indicator across the application
 * while decoupling the rest of the app from DaisyUI specifics
 */
export const Loading: FunctionComponent<LoadingProps> = ({
    size = 'lg',
    text = 'Loading...',
    className = ''
}): ReactElement => {
    const sizeClasses = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}>
            {/* Primary spinner - CSS based */}
            <div
                className={`${sizeClasses[size]} border-4 border-base-300 border-t-primary rounded-full animate-spin`}
            />

            {/* Alternative DaisyUI spinner */}
            <span
                className="loading loading-spinner loading-lg text-primary"
                style={{ display: 'none' }}
            />

            {text ? <p className="text-base-content text-sm font-medium">{text}</p> : null}
        </div>
    );
};
