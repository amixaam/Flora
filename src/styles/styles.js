import { StyleSheet } from "react-native";
import { colors, spacing } from "./constants";

export const mainStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },

    topbarContainer: {
        backgroundColor: "transparent",
        paddingHorizontal: spacing.appPadding,
        paddingVertical: spacing.sm,
        rowGap: spacing.sm,
    },
    roundButton: {
        backgroundColor: "rgba(74, 68, 88, 0.2)",
        borderRadius: spacing.round,
        padding: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    button_skeleton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: spacing.radius,
    },
    text_input_skeleton: {
        flex: 1,
        maxHeight: 45,
        borderRadius: spacing.radius,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },

    songListItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: spacing.md,
        borderBottomWidth: 1,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    selectedSongListItem: {
        backgroundColor: "rgba(74, 68, 88, 0.3)",
    },

    textListItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderBottomWidth: 1,
        columnGap: spacing.md,
        borderColor: "rgba(74, 68, 88, 0.2)",
    },
    hiddenListItem: { opacity: 0.5 },

    miniPlayer: {
        flexDirection: "column",

        rowGap: spacing.sm,
        paddingTop: spacing.md,
        paddingHorizontal: spacing.appPadding,

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
        borderRadius: spacing.radius,
        padding: spacing.appPadding,
        margin: spacing.appPadding,
        rowGap: spacing.sm,
    },
});
