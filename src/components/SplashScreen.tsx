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
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-all duration-700 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
                }`}
        >
            <div className="relative flex flex-col items-center max-w-2xl px-6 text-center animate-in fade-in zoom-in duration-1000">
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Icon */}
                <div className="relative mb-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
                    <FaMapMarkedAlt className="w-16 h-16 text-blue-600 dark:text-blue-500" />
                </div>

                {/* Text Content */}
                <h1 className="relative text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                    P2M Interactive Map
                    <span className="block text-xl md:text-2xl mt-2 font-medium text-zinc-500 dark:text-zinc-400">
                        Politeknik Negeri Batam
                    </span>
                </h1>

                <p className="relative text-lg text-zinc-600 dark:text-zinc-300 mb-10 max-w-lg leading-relaxed">
                    Jelajahi dan temukan berbagai program
                    <span className="font-semibold text-blue-600 dark:text-blue-400"> Pengabdian Kepada Masyarakat </span>
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
                        className="relative group flex items-center gap-3 px-8 py-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full font-semibold text-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Tutorial
                        <FaQuestionCircle className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Footer / Credits */}
            <div className="absolute bottom-8 text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Pusat Penelitian dan Pengabdian Kepada Masyarakat
            </div>
        </div>
    );
}
