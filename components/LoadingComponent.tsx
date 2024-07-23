'use client'

import { useLoadingScreenStore } from "../state/store/loadingScreenStore";
import { useEffect } from "react";

export default function LoadingComponent() {

  const [isLoadingScreenOpen, openLoadingScreen, closeLoadingScreen] = useLoadingScreenStore((state) => [
    state.isLoadingScreenOpen,
    state.openLoadingScreen,
    state.closeLoadingScreen
  ])

  useEffect(() => {
    console.log('show load')
    const timer = setTimeout(() => {
      closeLoadingScreen()
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [])

  return (
    <div className={`h-screen w-screen flex z-[1000]  bg-slate-600/50 backdrop-blur-sm bg-cc5 dark:bg-co5 items-center justify-center fixed px-8 top-0 left-0 transition-opacity duration-500 ${isLoadingScreenOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col items-center">
        {/* <h2 className="mb-4 text-xl font-semibold text-center text-cc1">Preparando nuestros servicios...</h2> */}
        <div className="w-12 h-12 border-t-2 rounded-full border-cc3 dark:border-co3 animate-spin"></div>

      </div>
    </div>
  );
}