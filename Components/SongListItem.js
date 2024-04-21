import { router } from "expo-router";
import { TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from "react-native-paper";
import { mainStyles, textStyles } from "./styles";

const SongListItem = (
    { item },
    addSongLike,
    removeSongLike,
    handleOpenPress,
    setSelectedSong,
    isCurrentTrack
) => {
    const handleEditSong = () => {
        setSelectedSong(item);
        handleOpenPress();
    };
    const handleRedirectToPlayer = () => {
        router.push("/(player)/" + item.id);
    };

    return (
        <TouchableNativeFeedback
            onPress={handleRedirectToPlayer}
            onLongPress={handleEditSong}
            delayLongPress={250}
        >
            <View
                style={[
                    mainStyles.songListItem,
                    isCurrentTrack ? mainStyles.selectedSongListItem : {},
                    item.isHidden ? mainStyles.hiddenListItem : {},
                ]}
            >
                <View
                    style={{
                        columnGap: 16,
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    {isCurrentTrack && (
                        <MaterialCommunityIcons
                            name="volume-high"
                            size={24}
                            style={mainStyles.color_text}
                        />
                    )}
                    <Text
                        style={[
                            {
                                flex: 1,
                                overflow: "hidden",
                            },
                            textStyles.text,
                        ]}
                        numberOfLines={1}
                    >
                        {item.isHidden ? "(Hidden) " : ""}
                        {item.name}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        item.isLiked
                            ? removeSongLike(item.id)
                            : addSongLike(item.id)
                    }
                >
                    <MaterialCommunityIcons
                        name={item.isLiked ? "heart" : "heart-outline"}
                        size={24}
                        style={mainStyles.color_text}
                    />
                </TouchableOpacity>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SongListItem;
