import { ImageBackground, TouchableNativeFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useActiveTrack } from "react-native-track-player";
import { useSongsStore } from "../store/songs";
import { Colors, IconSizes, Spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { Song } from "../types/song";
import Checkbox from "./UI/Checkbox";
import IconButton from "./UI/IconButton";

interface SongListItemProps {
    item: Song;
    index?: number;

    isSelectMode?: boolean;
    showImage?: boolean;
    showNumeration?: boolean;
    isSelected?: boolean;

    onSelect?: () => void;
    handleOpenPress?: () => void;
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
    handleOpenPress = () => {},
    onPress = () => {},
}: SongListItemProps) => {
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
            onPress={onPress}
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
                        columnGap: Spacing.md,
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
                            {`${item.artist ? item.artist : "No artist"} • ${
                                item.year ? item.year : "No year"
                            }`}
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
}: {
    index: number;
    showNumeration: boolean;
}) => {
    if (!showNumeration) return;
    return (
        <View style={{ width: Spacing.md, opacity: 0.7 }}>
            <Text
                style={[
                    textStyles.small,
                    { textAlign: "center", fontWeight: "700" },
                ]}
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
            onPress={() => (isLiked ? unlikeSong(id) : likeSong(id))}
            icon={isLiked ? "heart" : "heart-outline"}
        />
    );
};

const PlayingIndicator = ({
    isCurrentTrack = false,
    showImage = false,
    image = require("../../assets/images/empty-cover.png"),
}: {
    isCurrentTrack: boolean;
    showImage: boolean;
    image?: string;
}) => {
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
                    borderRadius: Spacing.radius,
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
                    borderRadius: Spacing.radius,
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
                    size={IconSizes.md}
                    color={Colors.primary}
                />
            </ImageBackground>
        );
    }

    return (
        <MaterialCommunityIcons
            name="volume-high"
            size={IconSizes.md}
            color={Colors.primary}
        />
    );
};

export default SongListItem;
