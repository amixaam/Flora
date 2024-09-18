import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongSheet from "../../../Components/BottomSheets/Song/SongSheet";
import SongListItem from "../../../Components/SongListItem";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import useSearchBar from "../../../hooks/useSearchBar";
import { useSongsStore } from "../../../store/songs";
import { Colors, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { Album, Song } from "../../../types/song";
import { MusicInfo } from "../../../utils/TagReader";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import { TopButtonControls } from "../../../Components/TopPlaybackSorting";

export default function SongsTab() {
    const {
        songs,
        addSongs,
        setSelectedSong,
        addListToQueue,
        doesAlbumExist,
        createAlbum,
        getAlbumByName,
        addSongToAlbum,
        doesSongExist,
    } = useSongsStore();

    const search = useSearchBar();

    const filteredSongs = songs.filter(
        (song) =>
            song.title.toLowerCase().includes(search.toLowerCase()) ||
            song.artist.toLowerCase().includes(search.toLowerCase())
    );

    const processData = async (asset: MediaLibrary.Asset) => {
        if (doesSongExist(asset.id)) return "Song already exists";

        const musicData = await MusicInfo.getMusicInfoAsync(asset.uri, {
            title: true,
            artist: true,
            album: true,
            year: true,
        });

        if (musicData === null) {
            const songData: Song = {
                id: asset.id,
                url: asset.uri,

                title: asset.filename.split(".").slice(0, -1).join("."),
                artist: "No artist",
                year: "No year",
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
            addSongs([songData]);

            return "Invalid music file";
        }

        if (!doesAlbumExist(musicData?.album)) {
            const inputFields: Partial<Album> = {
                title: musicData.album,
                artist: musicData.artist,
                year: musicData.year,
            };
            createAlbum(inputFields);
        }

        const songData: Song = {
            id: asset.id,
            url: asset.uri,

            title: asset.filename.split(".").slice(0, -1).join("."),
            artist: musicData.artist ? musicData.artist : "No artist",
            year: musicData.year ? musicData.year : "No year",
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
        addSongs([songData]);

        const album = getAlbumByName(musicData.album);
        if (album) {
            addSongToAlbum(album.id, asset.id);
        }
        return "Saved to album";
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

        // check if there are new songs
        const newSongs = assets.filter(
            (asset) => !songs.some((song) => song.id === asset.id)
        );
        if (newSongs.length === 0) return;
        newSongs.forEach((song) => {
            processData(song);
        });
    };

    useEffect(() => {
        getFiles();
    }, []);

    const SongOptionsRef = useRef<BottomSheetModal>(null);
    const openSongOptions = useCallback(
        () => SongOptionsRef.current?.present(),
        []
    );
    const closeSongOptions = useCallback(
        () => SongOptionsRef.current?.dismiss(),
        []
    );

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
                data={filteredSongs}
                estimatedItemSize={1000}
                ListHeaderComponent={
                    <TopButtonControls
                        horizontalMargins={Spacing.md}
                        songs={filteredSongs ? filteredSongs : []}
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        progressViewOffset={insets.top * 2}
                        onRefresh={onRefresh}
                        colors={[Colors.bg]}
                        progressBackgroundColor={Colors.primary}
                    />
                }
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`Search "${search}" didn't find any results!`}
                        icon="magnify"
                    />
                }
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom + Spacing.miniPlayer,
                }}
                renderItem={({ item }) => {
                    return (
                        <SongListItem
                            item={item}
                            showImage={true}
                            onLongPress={() => {
                                setSelectedSong(item);
                                openSongOptions();
                            }}
                            onPress={() => {
                                setSelectedSong(item);
                                addListToQueue(songs, item);
                                router.push("/player");
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
