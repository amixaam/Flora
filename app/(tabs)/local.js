import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { Dimensions, View } from "react-native";

import * as MediaLibrary from "expo-media-library";
import { useSongsStore } from "../../store/songs";
import SongListItem from "../../Components/SongListItem";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";

export default function LocalFilesTab() {
    const {
        songs,
        setPlaylists,
        setSongs,
        addSongLike,
        removeSongLike,
        setSelectedSong,
    } = useSongsStore();

    // process new songs
    useEffect(() => {
        console.log("local renew");
        // return;
        (async () => {
            // get permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access media library was denied");
                return;
            }
            // get audio assets
            const { assets } = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio,
            });

            // check if there are new songs
            const newSongs = assets.filter(
                (asset) => !songs.some((song) => song.id === asset.id)
            );

            // process new songs
            const newSongsWithInfo = newSongs.map((asset) => {
                return {
                    uri: asset.uri,
                    filename: asset.filename,
                    id: asset.id,
                    name: asset.filename, //default
                    author: null,
                    date: null,
                    duration: asset.duration,
                    isLiked: false,
                    isHidden: false,
                    lastPlayed: null,
                    timesPlayed: 0,
                };
            });

            // append new songs
            setSongs([...songs, ...newSongsWithInfo]);
        })();
    }, []);

    // useEffect(() => {
    //     setSongs([]);
    //     setPlaylists([
    //         {
    //             id: "1",
    //             name: "Liked songs",
    //             description: "Your songs that you liked.",
    //             songs: [],
    //         },
    //     ]);
    // }, []);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    return (
        <View
            style={{
                height: Dimensions.get("window").height,
            }}
        >
            <FlashList
                data={songs}
                estimatedItemSize={80} // Adjust based on your item size
                renderItem={({ item }) =>
                    SongListItem(
                        { item },
                        addSongLike,
                        removeSongLike,
                        handleOpenPress,
                        setSelectedSong
                    )
                }
                keyExtractor={(item) => item.id} // Ensure unique keys
            />
            <EditSongBottomSheet ref={bottomSheetRef} />
        </View>
    );
}
