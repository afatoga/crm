import { useState } from 'react';

export default function useModal() {
	const [isShown, setIsShown] = useState<boolean>(false);
    const [template, setTemplate] = useState<string>('');

	// const toggle = () => setIsShown(!isShown);'

    let handleModal = (template = '') => {
        setIsShown(!isShown);
        if (template.length) {
            setTemplate(template);
        }
    };

	return {
        handleModal,
		isShown,
		template
	};
};