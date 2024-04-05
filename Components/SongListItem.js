import { router } from "expo-router";
import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SongListItem(
    { item },
    addSongLike,
    removeSongLike,
    handleOpenPress,
    setSelectedSong
) {
    const handleLongPress = () => {
        setSelectedSong(item);
        handleOpenPress();
    };
    const handlePress = () => {
        router.push("/(player)/" + item.id);
    };

    return (
        <TouchableNativeFeedback
            onPress={handlePress}
            onLongPress={handleLongPress}
            delayLongPress={250}
        >
            <View style={styles.listItem}>
                <Text
                    style={{
                        width: "90%",
                        overflow: "hidden",
                        color: item.isHidden ? "gray" : "black",
                    }}
                    numberOfLines={1}
                >
                    {item.isHidden ? "(Hidden) " : ""}
                    {item.name}
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        item.isLiked
                            ? removeSongLike(item.id)
                            : addSongLike(item.id)
                    }
                >
                    <MaterialIcons
                        name={item.isLiked ? "favorite" : "favorite-border"}
                        size={24}
                        color="red"
                    />
                </TouchableOpacity>
            </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 17,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});
