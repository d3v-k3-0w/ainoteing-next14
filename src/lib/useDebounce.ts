import { useEffect, useState } from 'react';

export const useDebounce = (value: string, delay: number) => {
	const [debounceValue, setDebounceValue] = useState(value);

	//++ si dejo de escribir después de 500 milisegundos esto rebota
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounceValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debounceValue;
};
