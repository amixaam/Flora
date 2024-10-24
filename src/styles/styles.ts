import { StyleSheet } from "react-native";
import { Colors, Spacing } from "./constants";

export const mainStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },

    transparentContainer: {
        flex: 1,
    },

    sheetContainer: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },

    fullSize: {
        width: "100%",
        height: "100%",
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
        paddingVertical: Spacing.mmd,
        paddingTop: Spacing.mmd + 2,
        borderRadius: Spacing.radiusSm,
    },

    text_input_skeleton: {
        borderRadius: Spacing.radiusSm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        paddingTop: Spacing.sm + 2,
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
        gap: Spacing.sm,
        paddingVertical: Spacing.mmd,
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
        padding: Spacing.lg,
        gap: Spacing.md,

        borderRadius: Spacing.radius,
        margin: Spacing.appPadding,

        backgroundColor: Colors.secondary,
        shadowColor: "black",
        elevation: 20,
    },
});

export const utilStyles = StyleSheet.create({
    center: {
        alignItems: "center",
        justifyContent: "center",
    },

    absoluteCover: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    selected: {
        backgroundColor: `${Colors.badgeRare}20`,
    },
});

export const newStyles = StyleSheet.create({
    chip: {
        backgroundColor: Colors.bg,
        borderRadius: Spacing.round,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderColor: Colors.secondary,
        borderWidth: 1.5,
    },
    chipSelected: { backgroundColor: Colors.secondary },

    songListItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.appPadding,
        paddingVertical: 14,
    },

    songListItemSelected: {
        backgroundColor: "rgba(74, 68, 88, 0.3)",
    },
    songListItemHidden: { opacity: 0.5 },

    recapBanner: {
        aspectRatio: 16 / 8,
        alignItems: "flex-end",
        flexDirection: "row",
        marginHorizontal: Spacing.appPadding,
        borderRadius: Spacing.radiusLg,
        overflow: "hidden",
    },

    miniPlayer: {
        padding: Spacing.mmd,
        paddingStart: 0,
        paddingEnd: Spacing.appPadding,

        flexDirection: "row",
        gap: Spacing.mmd,

        borderTopEndRadius: Spacing.radiusMd,
        borderTopStartRadius: Spacing.radiusMd,
        backgroundColor: Colors.secondary,
    },
});
