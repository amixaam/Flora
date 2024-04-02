import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSongsStore } from "../../store/songs";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons } from "@expo/vector-icons";
import SongListItem from "../../Components/SongListItem";

export default function PlaylistList() {
    const { playlist } = useLocalSearchParams();
    const { getPlaylist, setLikeSong, setUnlikeSong } = useSongsStore();

    const playlistData = getPlaylist(playlist);

    return (
        <View
            style={{
                padding: 16,
                flex: 1,
                alignItems: "center",
            }}
        >
            <View
                style={{
                    height: 250,
                    aspectRatio: 1,
                    borderRadius: 7,
                    backgroundColor: "gray",
                }}
            />
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 24,
                    marginBottom: 16,
                    marginTop: 8,
                }}
            >
                {playlistData.name}
            </Text>
            {/* <Text>{JSON.stringify(playlistData)}</Text> */}
            <View style={{ height: "100%", width: "100%" }}>
                <FlashList
                    data={playlistData.songs}
                    extraData={playlistData.songs}
                    renderItem={({ item }) =>
                        SongListItem({ item }, setLikeSong, setUnlikeSong)
                    }
                    estimatedItemSize={50}
                />
            </View>
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
