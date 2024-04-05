import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { Button, Dimensions, View } from "react-native";

import * as MediaLibrary from "expo-media-library";
import { useSongsStore } from "../../store/songs";
import SongListItem from "../../Components/SongListItem";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";
import PlaybackControls from "../../Components/PlaybackControls";
import { Appbar } from "react-native-paper";

export default function LocalFilesTab() {
    const {
        songs,
        setSongs,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        currentTrack,
    } = useSongsStore();

    const getFiles = async () => {
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
    };
    // process new songs
    useEffect(() => {
        console.log("local renew");
        getFiles();
    }, []);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    return (
        <View
            style={{
                height: "100%",
            }}
        >
            <Appbar.Header>
                <Appbar.Content title="Local files" />
                <Appbar.Action icon="refresh" onPress={getFiles} />
            </Appbar.Header>
            <FlashList
                data={songs}
                estimatedItemSize={80} // Adjust based on your item size
                renderItem={({ item }) =>
                    SongListItem(
                        { item },
                        addSongLike,
                        removeSongLike,
                        handleOpenPress,
                        setSelectedSong,
                        item.id === currentTrack.id ? true : false
                    )
                }
                keyExtractor={(item) => item.id} // Ensure unique keys
            />
            <PlaybackControls isMini={true} />
            <EditSongBottomSheet ref={bottomSheetRef} />
        </View>
    );
}
