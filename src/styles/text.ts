import { StyleSheet } from "react-native";
import { Colors, FontSize } from "./constants";

export const textStyles = StyleSheet.create({
    h3: {
        fontFamily: "Poppins-Bold",
        color: Colors.primary,
        fontSize: FontSize.h3,
        lineHeight: FontSize.h3 * 1.2,
    },
    h4: {
        fontFamily: "Poppins-Bold",
        color: Colors.primary,
        fontSize: FontSize.h4,
        lineHeight: FontSize.h4 * 1.2,
    },
    h5: {
        fontFamily: "Poppins-Bold",
        color: Colors.primary,
        fontSize: FontSize.h5,
        lineHeight: FontSize.h5 * 1.2,
    },
    h6: {
        fontFamily: "Poppins-Bold",
        color: Colors.primary,
        fontSize: FontSize.h6,
        lineHeight: FontSize.h6 * 1.2,
    },
    text: {
        fontFamily: "Poppins-Medium",
        color: Colors.primary,
        fontSize: FontSize.text,
        letterSpacing: 0.5,
        lineHeight: FontSize.text * 1.2,
    },
    small: {
        fontFamily: "Poppins-Medium",
        color: Colors.primary,
        fontSize: FontSize.small,
        lineHeight: FontSize.small * 1.2,
        letterSpacing: 0.5,
    },
    detail: {
        fontFamily: "Poppins-Medium",
        color: Colors.primary,
        fontSize: FontSize.detail,
        lineHeight: FontSize.detail * 1.2,
        letterSpacing: 0.5,
    },

    tip: {
        fontFamily: "Poppins-Medium",
        color: Colors.primary,
        fontSize: FontSize.small,
        lineHeight: FontSize.small * 1.2,
        letterSpacing: 0.5,
        opacity: 0.75,
    },
});
