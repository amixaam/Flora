import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";

import * as MediaLibrary from "expo-media-library";
import SongSheet from "../../Components/BottomSheets/SongSheet";
import MiniPlayer from "../../Components/MiniPlayer";
import SongListItem from "../../Components/SongListItem";
import SecondaryRoundIconButton from "../../Components/UI/SecondaryRoundIconButton";
import { useSongsStore } from "../../store/songs";
import { spacing } from "../../styles/constants";
import { mainStyles } from "../../styles/styles";
import { textStyles } from "../../styles/text";
import { router } from "expo-router";

export default function LocalFilesTab() {
    const {
        songs,
        setSongs,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        currentTrack,
        addToQueue,
        play,
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

    return (
        <View style={mainStyles.container}>
            <FlashList
                data={songs}
                estimatedItemSize={700}
                ListEmptyComponent={() => (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            columnGap: spacing.md,
                            marginTop: spacing.xl,
                        }}
                    >
                        <SecondaryRoundIconButton
                            icon="refresh"
                            onPress={getFiles}
                        />
                        <Text style={[textStyles.h6, { textAlign: "center" }]}>
                            No songs found!
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <SongListItem
                        item={item}
                        addSongLike={addSongLike}
                        removeSongLike={removeSongLike}
                        handleOpenPress={handleOpenPress}
                        setSelectedSong={setSelectedSong}
                        isCurrentTrack={item.id === currentTrack ? true : false}
                        showImage={true}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
            <SongSheet ref={bottomSheetRef} />
            <MiniPlayer />
        </View>
    );
}
