import { ImageBackground, TouchableNativeFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useActiveTrack } from "react-native-track-player";
import { useSongsStore } from "../store/songs";
import { Colors, IconSizes, Spacing } from "../styles/constants";
import { mainStyles, newStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { Song } from "../types/song";
import Checkbox from "./UI/Checkbox";
import IconButton from "./UI/IconButton";
import { CombineStrings } from "../utils/CombineStrings";

export interface SongListItemProps {
    item: Song;
    index?: number;

    isSelectMode?: boolean;
    showImage?: boolean;
    showNumeration?: boolean;
    isSelected?: boolean;

    onSelect?: () => void;
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

    onSelect = () => {},
    onLongPress = () => {},
    onPress = () => {},
}: SongListItemProps) => {
    const activeTrack = useActiveTrack();

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
                    activeTrack?.id === item.id &&
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
                        isCurrentTrack={activeTrack?.id === item.id}
                    />
                    <PlayingIndicator
                        image={item.artwork}
                        isCurrentTrack={activeTrack?.id === item.id}
                        showImage={showImage}
                    />
                    <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            flex: 1,
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
                    {isSelectMode && (
                        <Checkbox onPress={onSelect} isSelected={isSelected} />
                    )}
                    <LikeButton
                        isLiked={item.isLiked}
                        id={item.id}
                        isSelectMode={isSelectMode}
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
            size={IconSizes.sm}
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
                        : require("../../assets/images/empty-cover.png")
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
                        : require("../../assets/images/empty-cover.png")
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
