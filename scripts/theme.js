(() => {
    const root = document.documentElement;
    const themeKey = "lainsce-theme";
    const contrastKey = "lainsce-contrast";
    const themes = new Set(["system", "light", "dark"]);

    const readStorage = (key) => {
        try {
            return window.localStorage.getItem(key);
        } catch {
            return null;
        }
    };

    const writeStorage = (key, value) => {
        try {
            if (value === null) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, value);
            }
        } catch {
            // Private browsing and blocked storage should not disable the controls.
        }
    };

    const storedTheme = readStorage(themeKey);
    const initialTheme = themes.has(storedTheme) ? storedTheme : "system";
    const initialContrast = readStorage(contrastKey) === "high";

    const applyTheme = (theme) => {
        if (theme === "system") {
            root.removeAttribute("data-theme");
        } else {
            root.dataset.theme = theme;
        }
    };

    const applyContrast = (isHighContrast) => {
        if (isHighContrast) {
            root.dataset.contrast = "high";
        } else {
            root.removeAttribute("data-contrast");
        }
    };

    // Set the saved modes before the stylesheet is parsed to avoid a flash of the default palette.
    applyTheme(initialTheme);
    applyContrast(initialContrast);

    const updateThemeColor = () => {
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) {
            return;
        }

        const isDark = root.dataset.theme === "dark"
            || (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
        if (root.dataset.contrast === "high") {
            themeColor.content = isDark ? "#000000" : "#FFFFFF";
        } else {
            themeColor.content = isDark ? "#111111" : "#F2F2F2";
        }
    };

    const setupControls = () => {
        const picker = document.getElementById("theme-picker");
        const contrastToggle = document.getElementById("contrast-toggle");

        if (picker) {
            picker.value = initialTheme;
            picker.addEventListener("change", (event) => {
                const theme = themes.has(event.target.value) ? event.target.value : "system";
                applyTheme(theme);
                writeStorage(themeKey, theme === "system" ? null : theme);
                updateThemeColor();
            });
        }

        if (contrastToggle) {
            const syncContrastLabel = () => {
                const isHighContrast = root.dataset.contrast === "high";
                contrastToggle.setAttribute("aria-pressed", String(isHighContrast));
                contrastToggle.setAttribute(
                    "aria-label",
                    isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode",
                );
            };

            syncContrastLabel();
            contrastToggle.addEventListener("click", () => {
                const isHighContrast = root.dataset.contrast !== "high";
                applyContrast(isHighContrast);
                writeStorage(contrastKey, isHighContrast ? "high" : null);
                syncContrastLabel();
                updateThemeColor();
            });
        }

        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (systemTheme.addEventListener) {
            systemTheme.addEventListener("change", updateThemeColor);
        } else {
            systemTheme.addListener?.(updateThemeColor);
        }
        updateThemeColor();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupControls, { once: true });
    } else {
        setupControls();
    }
})();
