import { useCallback, useEffect, useState } from "react";

const useTypewriter = (text: string, speed: number = 50, startDelay: number = 0) => {
    const [displayText, setDisplayText] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            setDisplayText('');
            return;
        }

        let currentIndex = 0;
        let intervalId: NodeJS.Timeout;
        let timeoutId: NodeJS.Timeout;

        const startTyping = () => {
            intervalId = setInterval(() => {
                currentIndex++;
                if (currentIndex <= text.length) {
                    setDisplayText(text.slice(0, currentIndex));
                } else {
                    clearInterval(intervalId);
                }
            }, speed);
        };

        setDisplayText('');

        if (startDelay > 0) {
            timeoutId = setTimeout(startTyping, startDelay);
        } else {
            startTyping();
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [text, speed, startDelay, isVisible]);

    const setVisibility = useCallback((visible: boolean) => {
        setIsVisible(visible);
    }, []);

    return { displayText, setIsVisible: setVisibility };
};

export default useTypewriter;