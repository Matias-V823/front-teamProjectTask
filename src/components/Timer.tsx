import { useEffect, useRef, useState } from "react";

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(1500);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioElementRef = useRef<HTMLAudioElement>(null);


    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }

        if (timeLeft === 0) {
            setIsRunning(false);
            audioElementRef.current?.play()
            clearInterval(intervalRef.current!);
        }

        return () => {
            clearInterval(intervalRef.current!);
        };
    }, [isRunning, timeLeft]);

    const handleButton = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const id = (e.target as HTMLElement).id;

        switch (id) {
            case '1':
                if (!isRunning) {
                    setIsRunning(true);
                }
                break;

            case '2':
                setIsRunning(false);
                break;

            case '3':
                setIsRunning(false);
                setTimeLeft(1500);
                break;
        }
    };

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const sec = (seconds % 60)
            .toString()
            .padStart(2, '0');
        return `${min}:${sec}`;
    };

    return (
        <div className="mb-8 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="text-center">
                <div className="text-5xl font-mono font-bold text-emerald-400 mb-3">
                    {formatTime(timeLeft)}
                </div>
                <div className="flex justify-center space-x-3" onClick={handleButton}>
                    <audio ref={audioElementRef} src="/audio/alarm.mp3" className="hidden"/>
                    <button
                        id="1"
                        className="px-4 py-2 bg-emerald-800/50 text-emerald-300 rounded-md hover:bg-emerald-700/50 transition-colors"
                    >
                        Iniciar
                    </button>
                    <button
                        id="2"
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Pausar
                    </button>
                    <button
                        id="3"
                        className="px-4 py-2 bg-rose-900/50 text-rose-300 rounded-md hover:bg-rose-800/50 transition-colors"
                    >
                        Reiniciar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Timer;
