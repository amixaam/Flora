import { ImageBackground, TouchableNativeFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useSongsStore } from "../../../store/songs";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import Checkbox from "../Buttons/Checkbox";
import IconButton from "../Buttons/IconButton";

export interface SongListItemProps {
    item: Song;
    index?: number;

    isSelectMode?: boolean;
    showImage?: boolean;
    showNumeration?: boolean;
    isSelected?: boolean;

    secondaryButtonIcon?: string;

    onSecondaryButtonPress?: () => void;
    onLongPress?: () => void;
    onPress?: () => void;
}

const SongListItem = ({
    item,
    index = 0,

    isSelectMode = false,
    showImage = false,
    showNumeration = false,
    isSelected = false,

    secondaryButtonIcon = undefined,

    onSecondaryButtonPress = () => {},
    onLongPress = () => {},
    onPress = () => {},
}: SongListItemProps) => {
    const { activeSong } = useSongsStore();

    const name = item.isHidden ? "(Hidden) " + item.title : item.title;

    return (
        <TouchableNativeFeedback
            onPress={onPress}
            onLongPress={isSelectMode ? undefined : onLongPress}
            delayLongPress={250}
        >
            <View
                style={[
                    newStyles.songListItem,
                    activeSong?.id === item.id &&
                        newStyles.songListItemSelected,
                    item.isHidden && newStyles.songListItemHidden,
                ]}
            >
                <View
                    style={{
                        columnGap: Spacing.md,
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    <Numeration
                        index={index}
                        showNumeration={showNumeration}
                        isCurrentTrack={activeSong?.id === item.id}
                    />
                    <PlayingIndicator
                        image={item.artwork}
                        isCurrentTrack={activeSong?.id === item.id}
                        showImage={showImage}
                    />
                    <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            flex: 1,
                            gap: Spacing.xs,
                        }}
                    >
                        <Text numberOfLines={1} style={[textStyles.text]}>
                            {name}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[textStyles.small, { opacity: 0.75 }]}
                        >
                            {CombineStrings([item.artist, item.year])}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        height: "100%",
                        justifyContent: "center",
                        paddingLeft: Spacing.appPadding,
                    }}
                >
                    {isSelectMode && <Checkbox isSelected={isSelected} />}
                    {secondaryButtonIcon && (
                        <IconButton
                            touchableOpacityProps={{
                                onPress: onSecondaryButtonPress,
                            }}
                            icon={secondaryButtonIcon}
                        />
                    )}
                    <LikeButton
                        isLiked={item.isLiked}
                        id={item.id}
                        isSelectMode={
                            isSelectMode || secondaryButtonIcon !== undefined
                        }
                    />
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

const Numeration = ({
    index,
    showNumeration,
    isCurrentTrack,
}: {
    index: number;
    showNumeration: boolean;
    isCurrentTrack: boolean;
}) => {
    if (!showNumeration) return;

    if (isCurrentTrack) {
        return (
            <MaterialCommunityIcons
                name="volume-high"
                size={IconSizes.sm}
                color={Colors.primary}
            />
        );
    }

    return (
        <View style={{ width: Spacing.md }}>
            <Text
                style={[textStyles.text, { textAlign: "center", opacity: 0.8 }]}
            >
                {index + 1}
            </Text>
        </View>
    );
};

const LikeButton = ({
    isLiked = false,
    id,
    isSelectMode = false,
}: {
    isLiked: boolean;
    id: string;
    isSelectMode: boolean;
}) => {
    const { likeSong, unlikeSong } = useSongsStore();
    if (isSelectMode) return;
    return (
        <IconButton
            touchableOpacityProps={{
                onPress: () => (isLiked ? unlikeSong(id) : likeSong(id)),
            }}
            icon={isLiked ? "heart" : "heart-outline"}
        />
    );
};

const PlayingIndicator = ({
    isCurrentTrack = false,
    showImage = false,
    image,
}: {
    isCurrentTrack: boolean;
    showImage: boolean;
    image?: string;
}) => {
    if (!isCurrentTrack && showImage) {
        return (
            <ImageBackground
                source={
                    image
                        ? { uri: image }
                        : require("../../../../assets/images/empty-cover.png")
                }
                style={{
                    height: 48,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                imageStyle={{ borderRadius: Spacing.radiusSm }}
            />
        );
    }

    if (showImage) {
        return (
            <ImageBackground
                source={
                    image
                        ? { uri: image }
                        : require("../../../../assets/images/empty-cover.png")
                }
                style={{
                    height: 48,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                imageStyle={{ borderRadius: Spacing.radiusSm }}
            >
                <View
                    style={{
                        backgroundColor: "#00000090",
                        width: "100%",
                        aspectRatio: 1,
                        position: "absolute",
                    }}
                />
                <MaterialCommunityIcons
                    name="volume-high"
                    size={IconSizes.sm}
                    color={Colors.primary}
                />
            </ImageBackground>
        );
    }

    return;
};

export default SongListItem;
