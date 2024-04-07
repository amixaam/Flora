import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import SongListItem from "../../Components/SongListItem";
import { useEffect, useRef } from "react";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";
import { useSongsStore } from "../../store/songs";
import EditPlaylistOptionsBottomSheet from "../../Components/BottomSheets/EditPlaylistOptionsBottomSheet";
import AlbumArt from "../../Components/AlbumArt";
import { mainStyles } from "../../Components/styles";
import Animated from "react-native-reanimated";
import React from "react";
// import { getColors } from "react-native-image-colors";

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

    useEffect(() => {
        console.log("[playlist] renew");
    }, []);

    const bottomSheetRef = useRef(null);
    const handleEditSong = () => bottomSheetRef.current.present();

    const editPlaylistBSR = useRef(null);
    const handleEditPlaylist = () => editPlaylistBSR.current.present();

    return (
        <>
            <AlbumArt
                image={playlistData.image}
                width={"100%"}
                height={"45%"}
                position={"absolute"}
            />

            <View style={mainStyles.container}>
                <View style={{ padding: 16, alignItems: "center", rowGap: 4 }}>
                    <AlbumArt
                        image={playlistData.image}
                        width={250}
                        aspectRatio={1}
                        borderRadius={7}
                    />
                    <Animated.Text
                        sharedTransitionTag={playlistData.name}
                        style={mainStyles.text_24}
                    >
                        {playlistData.name}
                    </Animated.Text>
                    <Text style={mainStyles.text_12}>
                        {playlistData.description}
                    </Text>
                </View>
                {playlistData.songs.length === 0 && (
                    <Text style={[mainStyles.text_16, { textAlign: "center" }]}>
                        Add songs to this playlist to view them!
                    </Text>
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
        </>
    );
}
