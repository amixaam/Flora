import { Text, View } from "react-native";
import { IconButton, TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSongsStore } from "../../../store/songsStore";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { utilStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import AlbumArt from "./AlbumArt";
import React from "react";
import { IconButtonProps } from "../Headers/SheetHeader";
import { useActiveTrack } from "react-native-track-player";

type SongItemProps = {
    song: Song;
    rightSideProps?: LeftSideProps;
    controls?: IconButtonProps | React.ReactElement;
    isActive?: boolean | undefined;

    onPress?: () => void;
    onLongPress?: () => void;
};

const SongItem = ({
    song,
    rightSideProps,
    controls,
    isActive = undefined,

    onPress,
    onLongPress,
}: SongItemProps) => {
    const activeSong = useActiveTrack();

    let active;

    if (typeof isActive === "boolean") {
        active = isActive;
    } else {
        active = activeSong?.id === song.id;
    }

    const ControlsDisplay = (): React.ReactNode => {
        if (!controls) return <RightSide />;
        if (React.isValidElement(controls)) return controls;
        return <RightSide {...controls} />;
    };

    const songInfo = (
        <View style={{ gap: Spacing.xs, flex: 1 }}>
            <Text numberOfLines={2} style={textStyles.text}>
                {song.title}
            </Text>
            <Text
                numberOfLines={1}
                style={[textStyles.small, { opacity: 0.75 }]}
            >
                {CombineStrings([song.artist, song.year])}
            </Text>
        </View>
    );

    return (
        <TouchableRipple
            onPress={onPress}
            onLongPress={onLongPress}
            style={active ? utilStyles.selected : undefined}
        >
            <View
                style={{
                    paddingVertical: Spacing.mmd,
                    paddingHorizontal: Spacing.appPadding,
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        gap: Spacing.md,
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    <LeftSide
                        image={song.artwork}
                        active={activeSong?.id === song.id}
                        count={rightSideProps?.count}
                    />
                    {songInfo}
                </View>
                {ControlsDisplay()}
            </View>
        </TouchableRipple>
    );
};

interface LeftSideProps {
    image?: string | undefined;
    active?: boolean;
    count?: number;
}

const LeftSide = ({ image, active = false, count }: LeftSideProps) => {
    const size = count ? 32 : 48;
    const speakerIcon = (
        <MaterialCommunityIcons
            name="volume-high"
            color={Colors.primary}
            size={IconSizes.md}
            testID="volume-high"
        />
    );

    if (count) {
        const countText = (
            <Text style={[textStyles.text, { opacity: 0.75 }]}>{count}</Text>
        );

        return (
            <View style={[utilStyles.center, { height: size, aspectRatio: 1 }]}>
                {active ? speakerIcon : countText}
            </View>
        );
    }

    const albumArt = <AlbumArt image={image} style={{ height: size }} />;

    if (active) {
        return (
            <View>
                {albumArt}
                <View
                    style={[
                        utilStyles.center,
                        utilStyles.absoluteCover,
                        {
                            backgroundColor: Colors.bg + 75,
                        },
                    ]}
                >
                    {speakerIcon}
                </View>
            </View>
        );
    }

    return albumArt;
};

const RightSide = ({ icon = "dots-vertical", onPress }: IconButtonProps) => {
    return (
        <IconButton
            testID={icon + "-button"}
            icon={icon}
            style={{ marginRight: -Spacing.sm }}
            onPress={onPress}
            iconColor={Colors.primary}
        />
    );
};

export default SongItem;
