import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSongsStore } from "../../store/songs";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons } from "@expo/vector-icons";
import SongListItem from "../../Components/SongListItem";

export default function PlaylistSettings() {
    return (
        <View
            style={{
                padding: 16,
                flex: 1,
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 24,
                    marginBottom: 16,
                    marginTop: 8,
                }}
            >
                Settings
            </Text>
        </View>
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
