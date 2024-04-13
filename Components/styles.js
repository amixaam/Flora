import { StyleSheet } from "react-native";
import {
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
    useFonts,
} from "@expo-google-fonts/poppins";

export const mainStyles = StyleSheet.create({
    color_text: {
        color: "#E8DEF8",
    },
    text_24: {
        color: "#E8DEF8",
        fontWeight: "800",
        fontSize: 24,
    },
    text_16: {
        color: "#E8DEF8",
        fontWeight: "800",
        fontSize: 16,
    },
    text_12: {
        color: "#E8DEF8",
        fontWeight: "500",
        fontSize: 12,
    },
    text_10: {
        color: "#E8DEF8",
        fontWeight: "400",
        fontSize: 10,
    },
    color_bg: {
        backgroundColor: "#050506",
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
        marginHorizontal: 18,
    },
    container: {
        // height: "100%",
        flex: 1,
        backgroundColor: "#050506",
    },
    topbarContainer: {
        backgroundColor: "#050506",
        paddingHorizontal: 18,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        borderBottomWidth: 2,
        borderColor: "rgba(232, 222, 248, 0.1)",
    },
    topBarText: {
        fontWeight: "bold",
        fontSize: 32,
        color: "#E8DEF8",
    },
    roundButton: {
        backgroundColor: "rgba(74, 68, 88, 0.2)",
        borderRadius: 9999,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    formButton: {
        backgroundColor: "rgba(74, 68, 88, 1)",
        padding: 8,
        borderRadius: 8,
        fontSize: 16,
    },
    textInput: {
        backgroundColor: "rgba(74, 68, 88, 0.5)",
        padding: 8,
        borderRadius: 8,
        color: "#E8DEF8",
        fontSize: 16,
    },

    songListItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 2,
        columnGap: 16,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    selectedSongListItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 2,
        columnGap: 16,
        backgroundColor: "rgba(74, 68, 88, 0.2)",
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    textListItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 2,
        columnGap: 16,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    hiddenListItem: { opacity: 0.3 },

    miniPlayer: {
        flexDirection: "column",
        rowGap: 4,
        margin: 8,
        padding: 8,
        backgroundColor: "#16151B",
        borderRadius: 10,
        marginTop: 0,
    },
    backgroundBlur: {
        width: "100%",
        flex: 1,
        opacity: 0.5,
        resizeMode: "cover",
        position: "absolute",
    },
});
