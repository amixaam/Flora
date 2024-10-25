import React from "react";
import { PressableProps, StyleProp, Text, View, ViewStyle } from "react-native";
import {
    IconButton,
    TouchableRipple,
    TouchableRippleProps,
} from "react-native-paper";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { utilStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist, Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import Pluralize from "../../../utils/Pluralize";
import { IconButtonProps } from "../Headers/SheetHeader";
import AlbumArt from "./AlbumArt";

interface ContainerItemProps extends PressableProps {
    item: Playlist | Album | Song;
    icon?: IconButtonProps;
    selected?: boolean;
    selectPadding?: boolean;
    playOverlay?: boolean;
}

const ContainerItem = ({
    item,
    icon,
    selected = false,
    selectPadding = true,
    playOverlay = false,
    ...PressableProps
}: ContainerItemProps) => {
    const albumInfo = (
        <View>
            <View style={[utilStyles.center]}>
                <AlbumArt
                    image={item.artwork}
                    style={{
                        aspectRatio: 1,
                        width: "100%",
                        marginBottom: Spacing.sm,
                    }}
                />
                {"sampleRate" in item && (
                    <IconButton
                        icon={"play-circle"}
                        iconColor={Colors.primary + "f0"}
                        size={IconSizes.xl}
                        style={{
                            position: "absolute",
                            backgroundColor: Colors.bg + "70",
                        }}
                    />
                )}
                <IconButton
                    icon={icon?.icon ? icon.icon : "dots-vertical"}
                    iconColor={Colors.primary}
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                    onPress={icon?.onPress}
                />
            </View>
            <Text numberOfLines={1} style={textStyles.h6}>
                {item.title}
            </Text>
            <Text
                numberOfLines={1}
                style={[textStyles.small, { opacity: 0.75 }]}
            >
                {"artist" in item
                    ? CombineStrings([item.artist, item.year])
                    : Pluralize(item.songs.length, "song", "songs")}{" "}
            </Text>
        </View>
    );

    return (
        <TouchableRipple
            {...(PressableProps as TouchableRippleProps)}
            style={[
                PressableProps.style as StyleProp<ViewStyle>,
                {
                    marginBottom: Spacing.sm,
                },
            ]}
            testID="container-item"
        >
            {albumInfo}
        </TouchableRipple>
    );
};

export default ContainerItem;
