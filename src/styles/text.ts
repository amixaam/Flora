import { StyleSheet } from "react-native";
import { Colors, FontSize } from "./constants";

export const textStyles = StyleSheet.create({
    h3: {
        fontFamily: "Poppins-Bold",
        color: Colors.primary,
        fontSize: FontSize.h3,
    },
    h4: {
        fontFamily: "Poppins-Bold",
        color: Colors.primary,
        fontSize: FontSize.h4,
    },
    h5: {
        fontFamily: "Poppins-Bold",
        color: Colors.primary,
        fontSize: FontSize.h5,
    },
    h6: {
        fontFamily: "Poppins-Medium",
        color: Colors.primary,
        fontSize: FontSize.h6,
        marginBottom: -4,
    },
    text: {
        fontFamily: "Poppins-Medium",
        color: Colors.primary,
        fontSize: FontSize.text,
    },
    small: {
        fontFamily: "Poppins-Regular",
        opacity: 0.7,
        color: Colors.primary,
        fontSize: FontSize.small,
    },
    detail: {
        fontFamily: "Poppins-Regular",
        opacity: 0.7,
        color: Colors.primary,
        fontSize: FontSize.detail,
    },
});
