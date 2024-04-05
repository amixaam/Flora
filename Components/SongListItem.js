import { router } from "expo-router";
import {
    StyleSheet,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from "react-native-paper";

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
                style={[isCurrentTrack ? styles.currentTrack : styles.listItem]}
            >
                {isCurrentTrack && (
                    <MaterialCommunityIcons
                        name="volume-high"
                        size={24}
                        color="black"
                    />
                )}
                <Text
                    style={{
                        flex: 1,
                        overflow: "hidden",
                        color: item.isHidden ? "gray" : "black",
                    }}
                    numberOfLines={1}
                >
                    {item.isHidden ? "(Hidden) " : ""}
                    {item.name}
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        columnGap: 8,
                        alignItems: "center",
                    }}
                >
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
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEditSong}>
                        <MaterialCommunityIcons
                            name="dots-vertical"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default SongListItem;

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        columnGap: 16,
        borderColor: "#F3EDF6",
    },
    currentTrack: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        columnGap: 16,
        backgroundColor: "#f6f2f7",
        borderColor: "#e2d5e6",
    },
});
