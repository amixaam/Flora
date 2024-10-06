import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongSheet from "../../../Components/BottomSheets/Song/SongSheet";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import SongListItem from "../../../Components/UI/UI chunks/SongListItem";
import { TopButtonControls } from "../../../Components/UI/UI chunks/TopPlaybackSorting";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { useSongsStore } from "../../../store/songs";
import { Colors, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import * as MediaLibrary from "expo-media-library";
import { MetadataReader } from "../../../Metadata reader/MetadataReader";
import { Song } from "../../../types/song";
import SheetHeader from "../../../Components/UI/Headers/SheetHeader";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";

import * as TagReader from "expo-tag-reader";

export default function SongsTab() {
    const {
        songs,
        setSelectedSong,
        addListToQueue,
        addSongs,
        createAlbum,
        addSongToAlbum,
        doesSongExist,
        getAlbumByName,
    } = useSongsStore();

    console.log(readAudioFiles());

    const SaveSong = async (asset: MediaLibrary.Asset) => {
        // Song already exists
        if (doesSongExist(asset.id)) return;

        const metadata = await MetadataReader(asset.uri);

        // init song object and add it to store
        const song: Song = {
            id: asset.id,
            albumIds: [],

            url: asset.uri,

            title:
                metadata.title ||
                asset.filename.split(".").slice(0, -1).join("."),
            artist: metadata.artist || "No artist",
            year: metadata.year || "No year",
            artwork: undefined,
            duration: asset.duration,

            isLiked: false,
            isHidden: false,
            statistics: {
                creationDate: new Date().toString(),
                lastPlayed: undefined,
                playCount: 0,
                skipCount: 0,
                lastModified: undefined,
            },
        };

        addSongs([song]);

        // Add song to album, if the neccessary metadata exists
        if (metadata.album) {
            const album = getAlbumByName(metadata.album);
            if (album) {
                addSongToAlbum(album.id, song.id);
                return;
            }

            const newAlbumId = createAlbum({
                title: metadata?.album,
                artist: metadata?.artist,
                year: metadata?.year,
            });

            addSongToAlbum(newAlbumId, song.id);
        }

        console.log("added song: " + song.title);
    };

    const getFiles = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access media library was denied");
            return;
        }

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

        // console.log(assets.map((asset) => asset.uri));

        // check if there are new songs
        const newSongs = assets.filter(
            (asset) => !songs.some((song) => song.id === asset.id)
        );
        if (newSongs.length === 0) return;
        newSongs.forEach((song) => {
            SaveSong(song);
        });
    };

    useEffect(() => {
        getFiles();

        // async function getMet() {
        //     await MetadataReader(
        //         "file:///storage/emulated/0/Download/Frog96 - Be, be, be, be!.flac"
        //     );
        // }
        // getMet();
    }, []);

    const {
        sheetRef: SongOptionsRef,
        open: openSongOptions,
        close: closeSongOptions,
    } = useBottomSheetModal();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getFiles();
        setRefreshing(false);
    }, []);
    const insets = useSafeAreaInsets();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <FlashList
                data={songs}
                estimatedItemSize={1000}
                ListHeaderComponent={
                    <MainHeader title="Songs" />
                    // <TopButtonControls
                    //     horizontalMargins={Spacing.md}
                    //     songs={songs}
                    // />
                }
                stickyHeaderHiddenOnScroll={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.bg]}
                        progressBackgroundColor={Colors.primary}
                    />
                }
                contentContainerStyle={{
                    paddingBottom: insets.bottom + Spacing.miniPlayer,
                }}
                renderItem={({ item }) => {
                    return (
                        <SongListItem
                            item={item}
                            showImage={true}
                            onLongPress={async () => {
                                await setSelectedSong(item);
                                openSongOptions();
                            }}
                            onPress={async () => {
                                await setSelectedSong(item);
                                addListToQueue(songs, item, true);
                            }}
                        />
                    );
                }}
                keyExtractor={(item) => item.id}
            />
            <SongSheet ref={SongOptionsRef} dismiss={closeSongOptions} />
        </View>
    );
}
