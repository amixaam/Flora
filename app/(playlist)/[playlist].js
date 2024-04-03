import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSongsStore } from "../../store/songs";
import { FlashList } from "@shopify/flash-list";
import SongListItem from "../../Components/SongListItem";
import { useRef } from "react";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";

export default function PlaylistList() {
    const { playlist } = useLocalSearchParams();
    const { getPlaylist, addSongLike, removeSongLike, setSelectedSong } =
        useSongsStore();

    const playlistData = getPlaylist(playlist);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

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
                    marginBottom: 4,
                    marginTop: 8,
                }}
            >
                {playlistData.name}
            </Text>
            <Text
                style={{
                    marginBottom: 16,
                }}
            >
                {playlistData.description}
            </Text>
            <View style={{ height: "100%", width: "100%" }}>
                {playlistData.songs.length === 0 && (
                    <Text style={{ textAlign: "center" }}>No songs here!</Text>
                )}
                <FlashList
                    data={playlistData.songs}
                    estimatedItemSize={50}
                    renderItem={({ item }) =>
                        SongListItem(
                            { item },
                            addSongLike,
                            removeSongLike,
                            handleOpenPress,
                            setSelectedSong
                        )
                    }
                    keyExtractor={(item) => item.id}
                />
            </View>
            <EditSongBottomSheet ref={bottomSheetRef} />
        </View>
    );
}
