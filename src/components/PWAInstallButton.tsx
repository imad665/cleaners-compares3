"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react"; // Optional icon, requires lucide-react installed

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setShowInstallButton(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the PWA installation prompt");
    } else {
      console.log("User dismissed the PWA installation prompt");
    }
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-4 start-4 z-[100000]"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 backdrop-blur-md"
        style={{
          animation: "pulse-glow 2.5s infinite",
        }}
      >
        <Download className="w-5 h-5" />
        Install App
      </motion.button >

      {/* Glowing effect style */}
      <style jsx>{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0px rgba(99, 102, 241, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.8);
          }
          100% {
            box-shadow: 0 0 0px rgba(99, 102, 241, 0.5);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PWAInstallButton;
