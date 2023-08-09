/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            primary: ["League Spartan", "sans-serif"],
        },
        extend: {
            colors: {
                primary: {
                    500: "#888eb0",
                    600: "#252945",
                    700: "#1e2139",
                    800: "#1f213a",
                    900: "#141625",
                },
                neutral: {
                    400: "#dfe3fa",
                    500: "#7e88c3",
                    700: "#494e6e",
                },
                danger: {
                    50: "#ead9d8",
                    100: "#ff9797",
                    400: "#f56363",
                    500: "hsl(0, 80%, 58%)",
                    900: "#4d2325",
                },
                accent: {
                    400: "#9277ff",
                    700: "#7a5cf7",
                },
                paid: {
                    100: "#1f2c3f",
                    400: "#33d69f",
                },
                pending: {
                    100: "#2b2736",
                    400: "#ff8f00",
                },
                draft: {
                    100: "#292c45",
                    400: "#dfe3fa",
                },
            },
        },
    },
    plugins: [],
}
