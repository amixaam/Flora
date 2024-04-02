import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SongListItem({ item }, setLikeSong, setUnlikeSong) {
    return (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/player/" + item.id)}
        >
            <Text>{item.name}</Text>
            <TouchableOpacity
                onPress={() =>
                    item.isLiked ? setUnlikeSong(item.id) : setLikeSong(item.id)
                }
            >
                <MaterialIcons
                    name={item.isLiked ? "favorite" : "favorite-border"}
                    size={24}
                    color="red"
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});
