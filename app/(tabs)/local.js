import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import * as MediaLibrary from "expo-media-library";
import SongSheet from "../../Components/BottomSheets/SongSheet";
import PlaybackControls from "../../Components/PlaybackControls";
import SongListItem from "../../Components/SongListItem";
import { mainStyles, textStyles } from "../../Components/styles";
import { useSongsStore } from "../../store/songs";
import { play } from "react-native-track-player/lib/src/trackPlayer";

export default function LocalFilesTab() {
    const {
        songs,
        setSongs,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        currentTrack,
        addToQueue,
        logQueue,
        logCurrentTrack,
        resetPlayer,
        playbackState,
        play,
        pause,
        nextTrack,
        previousTrack,
    } = useSongsStore();

    const getFiles = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access media library was denied");
            return;
        }
        // get all audio assets
        let assets = [];
        let endCursor;
        let hasNextPage = true;

        while (hasNextPage) {
            const {
                assets: batchAssets,
                endCursor: batchEndCursor,
                hasNextPage: batchHasNextPage,
            } = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio,
                after: endCursor,
            });

            assets.push(...batchAssets);
            endCursor = batchEndCursor;
            hasNextPage = batchHasNextPage;
        }

        // check if there are new songs
        const newSongs = assets.filter(
            (asset) => !songs.some((song) => song.id === asset.id)
        );

        const newSongsWithInfo = newSongs.map((asset) => {
            return {
                id: asset.id,
                uri: asset.uri,
                url: asset.uri,
                filename: asset.filename,
                duration: asset.duration,

                name: asset.filename, //default
                title: asset.filename, //default
                artist: "No artist",
                date: "No date",
                artwork: null,

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
        <View style={mainStyles.container}>
            <FlashList
                data={songs}
                estimatedItemSize={100}
                renderItem={({ item }) => (
                    <SongListItem
                        item={item}
                        addSongLike={addSongLike}
                        removeSongLike={removeSongLike}
                        handleOpenPress={handleOpenPress}
                        onPress={() => {
                            addToQueue(item);
                            play();
                        }}
                        setSelectedSong={setSelectedSong}
                        isCurrentTrack={item.id === currentTrack ? true : false}
                        showImage={true}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
            <PlaybackControls isMini={true} />
            <SongSheet ref={bottomSheetRef} />
        </View>
    );
}
