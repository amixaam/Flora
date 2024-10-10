import { AnimatedFlashList, FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongSheet from "../../../Components/BottomSheets/Song/SongSheet";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import SongListItem from "../../../Components/UI/UI chunks/SongListItem";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { useSongsStore } from "../../../store/songs";
import { Colors, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { UpdateMetadata } from "../../../utils/UpdateMetadata";
import { TopButtonControls } from "../../../Components/UI/UI chunks/TopPlaybackSorting";
import SongItem from "../../../Components/UI/UI chunks/SongItem";
import { Divider } from "react-native-paper";

export default function SongsTab() {
    const { songs, setSelectedSong, addListToQueue } = useSongsStore();
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        UpdateMetadata();
    }, []);

    const onRefresh = useCallback(async () => {
        if (refreshing) return;
        setRefreshing(true);
        await UpdateMetadata();
        setRefreshing(false);
    }, []);

    const {
        sheetRef: SongOptionsRef,
        open: openSongOptions,
        close: closeSongOptions,
    } = useBottomSheetModal();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <FlashList
                data={songs}
                estimatedItemSize={200}
                ListHeaderComponent={
                    <>
                        <MainHeader title="Songs" />
                        <TopButtonControls
                            horizontalMargins={Spacing.md}
                            songs={songs}
                            count={songs.length}
                            type="song"
                        />
                    </>
                }
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
                        <SongItem
                            song={item}
                            controls={{
                                onPress: async () => {
                                    await setSelectedSong(item);
                                    openSongOptions();
                                },
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
