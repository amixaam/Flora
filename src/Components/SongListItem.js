import { router } from "expo-router";
import { ImageBackground, TouchableNativeFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import IconButton from "./UI/IconButton";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { useSongsStore } from "../store/songs";
import { useActiveTrack } from "react-native-track-player";
import { colors, iconSizes, spacing } from "../styles/constants";

const SongListItem = ({
    item,

    isSelectMode = false,
    showImage = false,
    showNumeration = false,
    index = 0,

    isSelected = false,

    onSelect = () => {
        console.log("On select!");
    },
    handleOpenPress = () => {
        console.log("Open song options!");
    },
    onPress = (id) => {
        console.log("On press! ", id);
    },
}) => {
    const { setSelectedSong } = useSongsStore();
    const handleEditSong = () => {
        if (isSelectMode) return;
        setSelectedSong(item);
        handleOpenPress();
    };

    const activeTrack = useActiveTrack();

    const name = item.isHidden ? "(Hidden) " + item.title : item.title;
    return (
        <TouchableNativeFeedback
            onPress={() => onPress(item.id)}
            onLongPress={handleEditSong}
            delayLongPress={250}
        >
            <View
                style={[
                    mainStyles.songListItem,
                    activeTrack?.id === item.id
                        ? mainStyles.selectedSongListItem
                        : {},
                    item.isHidden ? mainStyles.hiddenListItem : {},
                ]}
            >
                <View
                    style={{
                        columnGap: spacing.md,
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    <Numeration index={index} showNumeration={showNumeration} />
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
                        <Text numberOfLines={1} style={[textStyles.small]}>
                            {item.artist ? item.artist : "No artist"}
                            {" • "}
                            {new Date(item.date).getFullYear()}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        height: "100%",
                        justifyContent: "center",
                        paddingLeft: spacing.appPadding,
                    }}
                >
                    <Checkboxes
                        onPress={onSelect}
                        isSelected={isSelected}
                        isSelectMode={isSelectMode}
                    />
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

const Numeration = ({ index, showNumeration }) => {
    if (!showNumeration) return;
    return (
        <View style={{ width: spacing.md, opacity: 0.7 }}>
            <Text
                style={[
                    textStyles.small,
                    mainStyles.color_text,
                    { textAlign: "center", fontWeight: "700" },
                ]}
            >
                {index + 1}
            </Text>
        </View>
    );
};

const Checkboxes = ({ onPress, isSelected, isSelectMode }) => {
    if (!isSelectMode) return;

    return (
        <IconButton
            onPress={onPress}
            icon={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
        />
    );
};

const LikeButton = ({ isLiked, id, isSelectMode = false }) => {
    const { removeSongLike, addSongLike } = useSongsStore();
    if (isSelectMode) return;
    return (
        <IconButton
            onPress={() => (isLiked ? removeSongLike(id) : addSongLike(id))}
            icon={isLiked ? "heart" : "heart-outline"}
        />
    );
};

const PlayingIndicator = ({ isCurrentTrack, showImage, image = null }) => {
    const url = image
        ? { uri: image }
        : require("../../assets/images/empty-cover.png");
    if (!isCurrentTrack && showImage) {
        return (
            <ImageBackground
                source={url}
                style={{
                    height: 48,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: spacing.radius,
                }}
            />
        );
    }
    if (!isCurrentTrack) return;

    if (showImage) {
        return (
            <ImageBackground
                source={url}
                style={{
                    height: 48,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: spacing.radius,
                }}
            >
                <View
                    style={{
                        backgroundColor: "#00000070",
                        width: "100%",
                        aspectRatio: 1,
                        position: "absolute",
                    }}
                />
                <MaterialCommunityIcons
                    name="volume-high"
                    size={iconSizes.md}
                    color={colors.primary}
                />
            </ImageBackground>
        );
    }

    return (
        <MaterialCommunityIcons
            name="volume-high"
            size={iconSizes.md}
            color={colors.primary}
        />
    );
};

export default SongListItem;
