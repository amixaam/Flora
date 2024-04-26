import { StyleSheet } from "react-native";
import {
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
    useFonts,
} from "@expo-google-fonts/poppins";

export const textStyles = StyleSheet.create({
    h3: {
        color: "#E8DEF8",
        fontWeight: "700",
        fontSize: 29.86,
    },
    h4: {
        color: "#E8DEF8",
        fontWeight: "700",
        fontSize: 20.74,
    },
    h5: {
        color: "#E8DEF8",
        fontWeight: "700",
        fontSize: 17.28,
    },
    h6: {
        color: "#E8DEF8",
        fontWeight: "700",
        fontSize: 14.4,
    },
    text: {
        color: "#E8DEF8",
        fontWeight: "500",
        fontSize: 12,
    },
    small: {
        color: "#E8DEF8",
        opacity: 0.7,
        fontWeight: "400",
        fontSize: 10,
    },
    detail: {
        color: "#E8DEF8",
        opacity: 0.7,
        fontWeight: "400",
        fontSize: 8.33,
    },
});

export const mainStyles = StyleSheet.create({
    // colors
    color_text: {
        color: "#E8DEF8",
    },
    color_bg: {
        backgroundColor: "#050506",
    },
    color_bg_primary: {
        backgroundColor: "#E8DEF8",
    },
    color_bg_secondary: {
        backgroundColor: "#16151B",
    },
    color_bg_input: {
        backgroundColor: "#2B2931",
    },
    color_bg_input_60: {
        backgroundColor: "#2B293160",
    },
    color_text_bg: {
        color: "#050506",
    },
    color_text_primary_90: {
        color: "#E8DEF890",
    },
    color_primary: {
        color: "#E8DEF8",
        backgroundColor: "#E8DEF8",
    },
    color_secondary: {
        color: "#16151B",
        backgroundColor: "#16151B",
    },
    page_margins_horizontal: {
        marginHorizontal: 16,
    },
    container: {
        flex: 1,
        backgroundColor: "#050506",
    },
    topbarContainer: {
        backgroundColor: "transparent",
        paddingHorizontal: 18,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    roundButton: {
        backgroundColor: "rgba(74, 68, 88, 0.2)",
        borderRadius: 9999,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    button_skeleton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 5,
    },
    text_input_skeleton: {
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },

    songListItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    selectedSongListItem: {
        backgroundColor: "rgba(74, 68, 88, 0.3)",
    },

    textListItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        columnGap: 16,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    hiddenListItem: { opacity: 0.5 },

    miniPlayer: {
        marginTop: -8,
        flexDirection: "column",
        rowGap: 8,
        padding: 8,
        backgroundColor: "#16151B",
    },
    backgroundBlur: {
        width: "100%",
        flex: 1,
        opacity: 0.5,
        resizeMode: "cover",
        position: "absolute",
    },
    modal: {
        borderRadius: 5,
        padding: 16,
        margin: 32,
        rowGap: 8,
    },
});
