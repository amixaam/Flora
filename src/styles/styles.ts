import { StyleSheet } from "react-native";
import {  Colors, Spacing } from "./constants";

export const mainStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },

    topbarContainer: {
        backgroundColor: "transparent",
        paddingHorizontal: Spacing.appPadding,
        paddingVertical: Spacing.sm,
        rowGap: Spacing.sm,
    },
    roundButton: {
        backgroundColor: "rgba(74, 68, 88, 0.2)",
        borderRadius: Spacing.round,
        padding: Spacing.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    button_skeleton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: Spacing.radius,
    },
    text_input_skeleton: {
        flex: 1,
        maxHeight: 45,
        borderRadius: Spacing.radius,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },

    songListItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    selectedSongListItem: {
        backgroundColor: "rgba(74, 68, 88, 0.3)",
    },

    textListItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: Spacing.md,
        borderBottomWidth: 1,
        columnGap: Spacing.md,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    hiddenListItem: { opacity: 0.5 },

    miniPlayer: {
        flexDirection: "column",

        rowGap: Spacing.sm,
        paddingTop: Spacing.md,
        paddingHorizontal: Spacing.appPadding,

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
        borderRadius: Spacing.radius,
        padding: Spacing.appPadding,
        margin: Spacing.appPadding,
        rowGap: Spacing.sm,
    },
});
