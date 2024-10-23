import React, { useEffect } from "react";
import { PressableProps, StyleProp, Text, View, ViewStyle } from "react-native";
import { Colors, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { Album, Playlist } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import Pluralize from "../../../utils/Pluralize";
import AlbumArt from "./AlbumArt";
import {
    IconButton,
    TouchableRipple,
    TouchableRippleProps,
} from "react-native-paper";
import { IconButtonProps } from "../Headers/SheetHeader";
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface ContainerItemProps extends PressableProps {
    item: Playlist | Album;
    icon?: IconButtonProps;
    selected?: boolean;
    selectPadding?: boolean;
}

const ContainerItem = ({
    item,
    icon,
    selected = false,
    selectPadding = true,
    ...PressableProps
}: ContainerItemProps) => {
    const padding = useSharedValue(0);

    useEffect(() => {
        padding.value = withTiming(selected ? Spacing.sm : 0, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            duration: 200,
        });
    }, [selected]);

    // // // // // idk man i think its better to just remove the padding animation
    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                padding.value,
                [0, Spacing.sm],
                [Colors.transparent, Colors.badgeRare + "50"]
            ),
            borderRadius: Spacing.radius,
        };
    });

    const albumInfo = (
        <View>
            <View style={{ position: "relative" }}>
                <AlbumArt
                    image={item.artwork}
                    style={{
                        aspectRatio: 1,
                        width: "100%",
                        marginBottom: Spacing.sm,
                    }}
                />
                <IconButton
                    icon={icon?.icon ? icon.icon : "dots-vertical"}
                    iconColor={Colors.primary}
                    style={{ position: "absolute", top: 0, right: 0 }}
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

    const AnimatedRipple = Animated.createAnimatedComponent(TouchableRipple);

    return (
        <AnimatedRipple
            {...(PressableProps as TouchableRippleProps)}
            style={[
                PressableProps.style as StyleProp<ViewStyle>,
                animatedStyle,
                {
                    marginBottom: Spacing.sm,
                },
            ]}
        >
            {albumInfo}
        </AnimatedRipple>
    );
};

export default ContainerItem;
