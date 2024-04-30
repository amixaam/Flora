import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";

import * as MediaLibrary from "expo-media-library";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import SongSheet from "../../../Components/BottomSheets/SongSheet";
import MiniPlayer from "../../../Components/MiniPlayer";
import SongListItem from "../../../Components/SongListItem";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import useSearchBar from "../../../hooks/useSearchBar";
import { useSongsStore } from "../../../store/songs";
import { spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
export default function SongsTab() {
    const {
        songs,
        setSongs,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        currentTrack,
        addListToQueue,
    } = useSongsStore();

    const search = useSearchBar("Search songs or artists...");

    const filteredSongs = useMemo(() => {
        return songs.filter(
            (song) =>
                song.title.toLowerCase().includes(search.toLowerCase()) ||
                song.artist.toLowerCase().includes(search.toLowerCase())
        );
    });

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
                url: asset.uri,

                title: asset.filename,
                artist: "No artist",
                date: "No date",
                artwork: null,
                duration: asset.duration,

                isLiked: false,
                isHidden: false,
                lastPlayed: null,
                timesPlayed: 0,
            };
        });

        setSongs([...songs, ...newSongsWithInfo]);
    };

    // process new songs
    useEffect(() => {
        console.log("local renew");
        getFiles();
    }, []);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[mainStyles.container]}>
            <FlashList
                data={filteredSongs}
                estimatedItemSize={700}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`Search "${search}" didn't find any results!`}
                        icon="magnify"
                    />
                }
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom * 2,
                }}
                renderItem={({ item }) => (
                    <SongListItem
                        item={item}
                        addSongLike={addSongLike}
                        removeSongLike={removeSongLike}
                        handleOpenPress={handleOpenPress}
                        setSelectedSong={setSelectedSong}
                        onPress={() => {
                            setSelectedSong(item);
                            addListToQueue(songs, item);
                            router.push("/player");
                        }}
                        isCurrentTrack={item.id === currentTrack ? true : false}
                        showImage={true}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
            <SongSheet ref={bottomSheetRef} />
        </ScrollView>
    );
}
