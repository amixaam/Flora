import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, View, StyleSheet, Text, Button } from "react-native";

import * as MediaLibrary from "expo-media-library";
import { useSongsStore } from "../../store/songs";
import SongListItem from "../../Components/SongListItem";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";

export default function LocalFilesTab() {
    const { songs, setSongs, setLikeSong, setUnlikeSong } = useSongsStore();
    const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

    // process new songs
    useEffect(() => {
        console.log("local renew");
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

    const bottomSheetRef = useRef(null);
    const handleClosePress = () => bottomSheetRef.current.close();
    const handleOpenPress = () => bottomSheetRef.current.expand();

    return (
        <View
            style={{
                height: Dimensions.get("window").height,
            }}
        >
            {/* <Text>{JSON.stringify(songs[0])}</Text> */}
            <Button title="close" onPress={handleClosePress} />
            <Button title="open" onPress={handleOpenPress} />
            <FlashList
                data={songs}
                estimatedItemSize={80} // Adjust based on your item size
                renderItem={({ item }) =>
                    SongListItem({ item }, setLikeSong, setUnlikeSong)
                }
                keyExtractor={(item) => item.id} // Ensure unique keys
            />
            {/* TODO: forwardRef */}
            <EditSongBottomSheet ref={bottomSheetRef} />
        </View>
    );
}
