const GOOGLE_GSI_SCRIPT_ID = "google-gsi-client-script";
let googleScriptPromise;

export const ensureGoogleIdentityLoaded = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_GSI_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity script")),
        {
          once: true,
        },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_GSI_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity script"));

    document.head.appendChild(script);
  });

  return googleScriptPromise;
};
