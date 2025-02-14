import React from 'react'

export function ButtonSolid({
    text,
    onClick,
    disable,
    hidden,
    children,
    link,
    title,
    icon,
    className,
    onMouseEnter,
    onMouseLeave
}) {
    return (
        <button
            onClick={onClick}
            disabled={disable}
            hidden={hidden}
            className={`button-solid flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-2 gap-3 rounded-xl button ${className}`}
            title={title}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...(link? { href: link } : {})}
        >
            {icon && <span className={`icon ${icon}`} />}
            {text}
            {children}
        </button>
    );
}
