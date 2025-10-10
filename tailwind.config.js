// tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom Hollow Gear palette
                "gear-brass": "#C59B42",
                "aether-blue": "#4E8BAE",
                "rust-red": "#A3472A",
                "paper-gray": "#F2EEE8",
                "iron-ink": "#1F1F1F",
                "steel-wash": "#D7D9DA",
                "aether-silver": "#B8BFC4",
                "radiant-gold": "#FAD55E",
                "verdigris-green": "#5F9E83",
                "overheat-ember": "#D1582C",
                "aether-glow": "#B9E3F9",
                "smokestack-gray": "#8D8F8E",
            },
            fontFamily: {
                heading: ['"Crimson Pro"', "serif"],
                sans: ["Inter", "Work Sans", "system-ui", "sans-serif"],
            },
        },
    },
    darkMode: "class",
    plugins: [
        heroui({
            themes: {
                light: {
                    colors: {
                        background: "#F2EEE8", // Paper Gray
                        foreground: "#1F1F1F", // Iron Ink
                        primary: {
                            50: "#FEF7E6",
                            100: "#FDE8BF",
                            200: "#FBD998",
                            300: "#F9CA71",
                            400: "#E5B456",
                            500: "#C59B42", // Gear Brass
                            600: "#A6833A",
                            700: "#876B31",
                            800: "#685329",
                            900: "#493B20",
                            DEFAULT: "#C59B42",
                            foreground: "#1F1F1F",
                        },
                        secondary: {
                            50: "#E9F3F8",
                            100: "#C7E0ED",
                            200: "#A5CDE2",
                            300: "#83BAD7",
                            400: "#69A4C2",
                            500: "#4E8BAE", // Aether Blue
                            600: "#447794",
                            700: "#3A637A",
                            800: "#304F60",
                            900: "#263B46",
                            DEFAULT: "#4E8BAE",
                            foreground: "#F2EEE8",
                        },
                        success: {
                            50: "#EDF7F2",
                            100: "#D1E9DF",
                            200: "#B5DBCC",
                            300: "#99CDB9",
                            400: "#7AB6A3",
                            500: "#5F9E83", // Verdigris Green
                            600: "#52876F",
                            700: "#45705C",
                            800: "#385948",
                            900: "#2B4235",
                            DEFAULT: "#5F9E83",
                            foreground: "#F2EEE8",
                        },
                        warning: {
                            50: "#FFF8EB",
                            100: "#FEEAC8",
                            200: "#FEDDA5",
                            300: "#FDD082",
                            400: "#FCC35F",
                            500: "#FAD55E", // Radiant Gold
                            600: "#D6B550",
                            700: "#B29542",
                            800: "#8E7534",
                            900: "#6A5526",
                            DEFAULT: "#FAD55E",
                            foreground: "#1F1F1F",
                        },
                        danger: {
                            50: "#FCEEE9",
                            100: "#F7D0C5",
                            200: "#F2B2A1",
                            300: "#ED947D",
                            400: "#E26E4E",
                            500: "#D1582C", // Overheat Ember
                            600: "#B34C26",
                            700: "#954020",
                            800: "#77341A",
                            900: "#592814",
                            DEFAULT: "#D1582C",
                            foreground: "#F2EEE8",
                        },
                        default: {
                            50: "#F8F9F9",
                            100: "#EDEEEF",
                            200: "#E2E4E5",
                            300: "#D7D9DA", // Steel Wash
                            400: "#C3C6C8",
                            500: "#B8BFC4", // Aether Silver
                            600: "#9DA5AA",
                            700: "#828B90",
                            800: "#677176",
                            900: "#4C575C",
                            DEFAULT: "#D7D9DA",
                            foreground: "#1F1F1F",
                        },
                    },
                },
                dark: {
                    colors: {
                        background: "#1F1F1F", // Iron Ink
                        foreground: "#F2EEE8", // Paper Gray
                        primary: {
                            50: "#493B20",
                            100: "#685329",
                            200: "#876B31",
                            300: "#A6833A",
                            400: "#C59B42",
                            500: "#E5B456",
                            600: "#F9CA71",
                            700: "#FBD998",
                            800: "#FDE8BF",
                            900: "#FEF7E6",
                            DEFAULT: "#C59B42", // Gear Brass
                            foreground: "#1F1F1F",
                        },
                        secondary: {
                            50: "#263B46",
                            100: "#304F60",
                            200: "#3A637A",
                            300: "#447794",
                            400: "#4E8BAE",
                            500: "#69A4C2",
                            600: "#83BAD7",
                            700: "#A5CDE2",
                            800: "#C7E0ED",
                            900: "#E9F3F8",
                            DEFAULT: "#4E8BAE", // Aether Blue
                            foreground: "#F2EEE8",
                        },
                        success: {
                            50: "#2B4235",
                            100: "#385948",
                            200: "#45705C",
                            300: "#52876F",
                            400: "#5F9E83",
                            500: "#7AB6A3",
                            600: "#99CDB9",
                            700: "#B5DBCC",
                            800: "#D1E9DF",
                            900: "#EDF7F2",
                            DEFAULT: "#5F9E83", // Verdigris Green
                            foreground: "#F2EEE8",
                        },
                        warning: {
                            50: "#6A5526",
                            100: "#8E7534",
                            200: "#B29542",
                            300: "#D6B550",
                            400: "#FAD55E",
                            500: "#FCC35F",
                            600: "#FDD082",
                            700: "#FEDDA5",
                            800: "#FEEAC8",
                            900: "#FFF8EB",
                            DEFAULT: "#FAD55E", // Radiant Gold
                            foreground: "#1F1F1F",
                        },
                        danger: {
                            50: "#592814",
                            100: "#77341A",
                            200: "#954020",
                            300: "#B34C26",
                            400: "#D1582C",
                            500: "#E26E4E",
                            600: "#ED947D",
                            700: "#F2B2A1",
                            800: "#F7D0C5",
                            900: "#FCEEE9",
                            DEFAULT: "#D1582C", // Overheat Ember
                            foreground: "#F2EEE8",
                        },
                        default: {
                            50: "#4C575C",
                            100: "#677176",
                            200: "#828B90",
                            300: "#9DA5AA",
                            400: "#B8BFC4",
                            500: "#C3C6C8",
                            600: "#D7D9DA",
                            700: "#E2E4E5",
                            800: "#EDEEEF",
                            900: "#F8F9F9",
                            DEFAULT: "#D7D9DA", // Steel Wash
                            foreground: "#1F1F1F",
                        },
                    },
                },
            },
        }),
    ],
};
