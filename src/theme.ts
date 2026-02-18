export const darkTheme = {
    colors: {
        textColor: "#9b9ca3",
        textColorHover: "#ffffff",
        innerDialog: "#393a41",
        memberProfileIcon: "#707175",
        memberProfileBackground: "#757e8a",
        white: "#ffffff",
        black: "#000000",

        gray100: "#dfe0e2",
        gray200: "#9b9ca3",
        gray300: "#3e3f45",
        gray400: "#2c2d32",
        gray500: "#757e8a",
        gray600: "#393a41",
        gray700: "#414148",
        gray800: "#323338",
        gray900: "#3d3d45",
        gray1000: "#35353a",
        gray1100: "#323339",
        gray1200: "#3a3b41",
        gray1400: "#464a52",

        blue100: "#8da1fc",
        blue200: "#5865f2",
        blue300: "#6571f3",
        blue400: "#4654c0",

        red100: "#f57976",
        red: "#ed4245",

        green: "#3ba55d",
        greenDark: "#2d7d32",

        orange: "#faa61a",
        purple: "#9c84ef",
    },
};

export const lightTheme = {
    colors: {
        textColor: "#666771",
        textColorHover: "#2f3035",
        innerDialog: "#ffffff",
        memberProfileIcon: "#ffffff",
        memberProfileBackground: "#666771",
        white: "#ffffff",
        black: "#000000",

        gray100: "#323339",
        gray200: "#666771",
        gray300: "#d9d9dc",
        gray400: "#f3f3f4",
        //gray600: "#787878",
        gray1000: "#e7e7e9",
        gray1100: "#fbfbfb",
        gray1200: "#eeeeef",
        gray1400: "#757e8a",

        blue100: "#8da1fc",
        blue200: "#5865f2",
        blue300: "#6571f3",
        blue400: "#4654c0",

        red100: "#f57976",
        red: "#ed4245",

        green: "#3ba55d",
        greenDark: "#2d7d32",

        orange: "#faa61a",
        purple: "#9c84ef",

        videoBackground: "#c5c7db",
    },
};

export type Theme = typeof darkTheme;

const theme = darkTheme;

export default theme;
