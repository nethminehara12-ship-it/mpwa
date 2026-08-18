"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaControls() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => (
    typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches
  ));
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in window.navigator) {
      window.navigator.serviceWorker.register("/sw.js").catch(() => {
        // The app remains usable online if service-worker registration is blocked.
      });
    }

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setShowHelp(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      setShowHelp((current) => !current);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  return (
    <div className="pwa-area">
      <div className="pwa-controls" aria-label="App availability">
        <span className={online ? "connection-status online" : "connection-status offline"}>
          <span aria-hidden="true" />
          {online ? "Ready online" : "Offline mode"}
        </span>
        <button className="install-button" type="button" onClick={handleInstall} disabled={installed}>
          {installed ? "Installed" : installPrompt ? "Install app" : "Add to phone"}
        </button>
      </div>
      {showHelp && !installed && (
        <p className="install-help" role="status">
          Open your browser menu, then choose <strong>Add to Home Screen</strong> or <strong>Install app</strong>.
        </p>
      )}
    </div>
  );
}
