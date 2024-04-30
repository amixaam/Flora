import { StyleSheet } from "react-native";
import { colors, fontSize } from "./constants";

export const textStyles = StyleSheet.create({
    h3: {
        fontFamily: "Poppins-Bold",
        color: colors.primary,
        fontSize: fontSize.h3,
    },
    h4: {
        fontFamily: "Poppins-Bold",
        color: colors.primary,
        fontSize: fontSize.h4,
    },
    h5: {
        fontFamily: "Poppins-Bold",
        color: colors.primary,
        fontSize: fontSize.h5,
    },
    h6: {
        fontFamily: "Poppins-Medium",
        color: colors.primary,
        fontSize: fontSize.h6,
    },
    text: {
        fontFamily: "Poppins-Medium",
        color: colors.primary,
        fontSize: fontSize.text,
    },
    small: {
        fontFamily: "Poppins-Regular",
        opacity: 0.7,
        color: colors.primary,
        fontSize: fontSize.small,
    },
    detail: {
        fontFamily: "Poppins-Regular",
        opacity: 0.7,
        color: colors.primary,
        fontSize: fontSize.detail,
    },
});
