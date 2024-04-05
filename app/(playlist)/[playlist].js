import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import SongListItem from "../../Components/SongListItem";
import { useRef } from "react";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import { useSongsStore } from "../../store/songs";

export default function PlaylistList() {
    const { playlist } = useLocalSearchParams();
    const { getPlaylist, addSongLike, removeSongLike, setSelectedSong } =
        useSongsStore();

    const playlistData = getPlaylist(playlist);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 16, alignItems: "center", rowGap: 4 }}>
                <LinearGradient
                    colors={["pink", "lightblue"]}
                    start={{ x: -0.5, y: 0 }}
                    end={{ x: 1, y: 1.5 }}
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
                    }}
                >
                    {playlistData.name}
                </Text>
                <Text>{playlistData.description}</Text>
            </View>
            {playlistData.songs.length === 0 && (
                <Text style={{ textAlign: "center" }}>No songs here!</Text>
            )}
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
                <FlashList
                    data={playlistData.songs}
                    estimatedItemSize={100}
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
