import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import SongListItem from "../../Components/SongListItem";
import { useRef } from "react";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import { useSongsStore } from "../../store/songs";
import { Appbar } from "react-native-paper";
import EditPlaylistOptionsBottomSheet from "../../Components/BottomSheets/EditPlaylistOptionsBottomSheet";
import AlbumArt from "../../Components/AlbumArt";

export default function PlaylistList() {
    const { playlist } = useLocalSearchParams();
    const {
        getPlaylist,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        currentTrack,
    } = useSongsStore();

    const playlistData = getPlaylist(playlist);

    const bottomSheetRef = useRef(null);
    const handleEditSong = () => bottomSheetRef.current.present();

    const editPlaylistBSR = useRef(null);
    const handleEditPlaylist = () => editPlaylistBSR.current.present();

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content title={playlistData.name} />
                <Appbar.Action icon="cog" onPress={handleEditPlaylist} />
            </Appbar.Header>
            <View style={{ padding: 16, alignItems: "center", rowGap: 4 }}>
                <AlbumArt
                    image={playlistData.image}
                    width={250}
                    aspectRatio={1}
                    borderRadius={7}
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
                            handleEditSong,
                            setSelectedSong,
                            item.id === currentTrack.id ? true : false
                        )
                    }
                    keyExtractor={(item) => item.id}
                />
            </View>
            <EditSongBottomSheet ref={bottomSheetRef} />
            <EditPlaylistOptionsBottomSheet ref={editPlaylistBSR} />
        </View>
    );
}
