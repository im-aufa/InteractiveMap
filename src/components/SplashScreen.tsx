"use client";

import { useEffect, useState } from "react";
import { FaMapMarkedAlt, FaArrowRight, FaQuestionCircle } from "react-icons/fa";
import { useTutorial } from "@/hooks/useTutorial";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Check if user has seen the splash screen in this session
        const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
        if (!hasSeenSplash) {
            // Only show if NOT seen yet
            setIsVisible(true);
        } else {
            // Otherwise, don't render it at all
            setShouldRender(false);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // Wait for animation to finish before removing from DOM
        setTimeout(() => {
            setShouldRender(false);
            sessionStorage.setItem("hasSeenSplash", "true");
        }, 700); // 700ms matches the transition duration
    };

    const { startTutorial } = useTutorial();

    const handleStartTutorial = () => {
        handleDismiss();
        // Delay slightly to allow splash screen to fade out before driver starts
        setTimeout(() => {
            startTutorial();
        }, 800);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
                }`}
        >
            {/* Backdrop Blur & Overlay */}
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl" />

            <div className="relative flex flex-col items-center max-w-2xl px-6 text-center animate-in fade-in zoom-in duration-1000">
                {/* Icon */}
                <div className="relative mb-8 p-6 bg-white/50 dark:bg-black/50 rounded-3xl shadow-xl border border-white/20 dark:border-white/10 backdrop-blur-md">
                    <FaMapMarkedAlt className="w-16 h-16 text-zinc-900 dark:text-white" />
                </div>

                {/* Text Content */}
                <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 drop-shadow-sm">
                    P2M Interactive Map
                    <span className="block text-xl md:text-2xl mt-2 font-medium text-zinc-700 dark:text-zinc-300">
                        Politeknik Negeri Batam
                    </span>
                </h1>

                <p className="relative text-lg text-zinc-800 dark:text-zinc-200 mb-10 max-w-lg leading-relaxed font-medium">
                    Jelajahi dan temukan berbagai program
                    <span className="font-bold text-zinc-900 dark:text-white"> Pengabdian Kepada Masyarakat </span>
                    yang tersebar di seluruh wilayah.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={handleDismiss}
                        className="relative group flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Mulai Jelajah
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={handleStartTutorial}
                        className="relative group flex items-center gap-3 px-8 py-4 bg-white/50 dark:bg-black/50 text-zinc-900 dark:text-white rounded-full font-semibold text-lg border border-white/20 dark:border-white/10 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/80 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Tutorial
                        <FaQuestionCircle className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

            {/* Footer / Credits */}
            <div className="absolute bottom-8 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                &copy; {new Date().getFullYear()} Pusat Penelitian dan Pengabdian Kepada Masyarakat
            </div>
        </div>
    );
}
