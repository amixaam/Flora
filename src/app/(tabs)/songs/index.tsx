import { FlashList } from "@shopify/flash-list";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { RefreshControl, View } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongSheet from "../../../Components/BottomSheets/SongSheet";
import SongListItem from "../../../Components/SongListItem";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import { useSongsStore } from "../../../store/songs";
import { Colors, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { Song } from "../../../types/song";
import useSearchBar from "../../../hooks/useSearchBar";

export default function SongsTab() {
    const { songs, addSongs, setSelectedSong, addListToQueue } =
        useSongsStore();

    const search = useSearchBar();

    const filteredSongs = useMemo(() => {
        return songs.filter(
            (song) =>
                song.title.toLowerCase().includes(search.toLowerCase()) ||
                song.artist.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

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

        console.log("newSongs: ", newSongs);

        if (newSongs.length === 0) return;

        const newSongsWithInfo = newSongs.map((asset): Song => {
            return {
                id: asset.id,
                url: asset.uri,

                title: "New song",
                artist: "No artist",
                year: "No year",
                artwork: undefined,
                duration: asset.duration,

                isLiked: false,
                isHidden: false,
                statistics: {
                    lastPlayed: undefined,
                    timesPlayed: 0,
                    timesSkipped: 0,
                },
            };
        });

        addSongs(newSongsWithInfo);
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
            <FlashList
                data={filteredSongs}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        progressViewOffset={insets.top * 2}
                        onRefresh={onRefresh}
                        colors={[Colors.bg]}
                        progressBackgroundColor={Colors.primary}
                    />
                }
                onEndReached={() => console.log("end reached!")}
                estimatedItemSize={1000}
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
