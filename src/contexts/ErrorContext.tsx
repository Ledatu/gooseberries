// ErrorContext.tsx
'use client';
import {createContext, useState, useContext, ReactNode} from 'react';

// Define the context shape
interface ErrorContextType {
    error: string | null;
    showError: (message: string) => void;
}

// Create the context with default values
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Hook to use the context
export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};

// ErrorProvider component props
interface ErrorProviderProps {
    children: ReactNode;
}

// Error Provider component
export const ErrorProvider: React.FC<ErrorProviderProps> = ({children}) => {
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => setError(null), 5000); // Auto-dismiss after 5 seconds
    };

    return <ErrorContext.Provider value={{error, showError}}>{children}</ErrorContext.Provider>;
};
