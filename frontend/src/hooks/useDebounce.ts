import { useEffect, useState } from "react"

export const useDebounce = (value: string, delay=300) => {
    const [deboucedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);

    return deboucedValue;
}