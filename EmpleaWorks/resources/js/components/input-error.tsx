import React from 'react';

interface InputErrorProps {
    message?: string;
    className?: string;
}

export default function InputError({ message, className = '' }: InputErrorProps) {
    return message ? (
        <p className={`text-sm text-destructive mt-1 ${className}`}>
            {message}
        </p>
    ) : null;
}
