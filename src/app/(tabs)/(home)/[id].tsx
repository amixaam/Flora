import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import SongSheet from "../../../Components/BottomSheets/SongSheet";
import ImageBlurBackground from "../../../Components/ImageBlurBackground";
import SongListItem from "../../../Components/SongListItem";
import IconButton from "../../../Components/UI/IconButton";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import PrimaryRoundIconButton from "../../../Components/UI/PrimaryRoundIconButton";
import SecondaryRoundIconButton from "../../../Components/UI/SecondaryRoundIconButton";
import { useSongsStore } from "../../../store/songs";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { CalculateTotalDuration } from "../../../utils/FormatMillis";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function PlaylistScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    if (typeof id === "undefined") return router.back();

    const {
        getPlaylist,
        getSongsFromPlaylist,
        shuffleList,
        addListToQueue,
        setSelectedSong,
    } = useSongsStore();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon="pencil" onPress={openPlaylistOptions} />
            ),
        });
    }, [navigation]);

    const playlistData = getPlaylist(id);
    const songData = getSongsFromPlaylist(id);

    const SongOptionsRef = useRef<BottomSheetModal>(null);
    const openSongOptions = useCallback(() => {
        SongOptionsRef.current?.present();
    }, []);
    const dismissSongOptions = useCallback(() => {
        SongOptionsRef.current?.dismiss();
    }, []);

    const PlaylistOptionsRef = useRef<BottomSheetModal>(null);
    const openPlaylistOptions = useCallback(() => {
        PlaylistOptionsRef.current?.present();
    }, []);

    const dismissPlaylistOptions = useCallback(() => {
        PlaylistOptionsRef.current?.dismiss();
    }, []);

    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[mainStyles.container]}>
            <ImageBlurBackground
                image={playlistData?.artwork}
                style={{ height: 520 }}
                gradientColors={[
                    "transparent",
                    "#05050655",
                    "#05050699",
                    "#050506",
                ]}
            />
            <View
                style={{
                    paddingTop: insets.top * 2,
                    padding: 16,
                    alignItems: "center",
                    rowGap: 8,
                }}
            >
                <AlbumArt
                    image={playlistData?.artwork}
                    style={{ width: 250, aspectRatio: 1, borderRadius: 7 }}
                />
                <View
                    style={{
                        marginVertical: 4,
                        rowGap: 4,
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Text style={[textStyles.h4, { textAlign: "center" }]}>
                        {playlistData?.title}
                    </Text>
                    <Text
                        style={[
                            textStyles.text,
                            { textAlign: "center", opacity: 0.7 },
                        ]}
                    >
                        {playlistData?.description}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        columnGap: 20,
                        alignItems: "center",
                    }}
                >
                    <SecondaryRoundIconButton
                        onPress={() =>
                            addListToQueue(songData, undefined, true)
                        }
                        icon="play"
                    />
                    <PrimaryRoundIconButton
                        icon="shuffle"
                        size={36}
                        onPress={() => shuffleList(songData, true)}
                    />
                    <SecondaryRoundIconButton
                        icon="pencil"
                        onPress={openPlaylistOptions}
                    />
                </View>
            </View>
            <View style={{ flex: 1, minHeight: 5 }}>
                <FlashList
                    data={songData.slice().reverse()}
                    estimatedItemSize={100}
                    ListEmptyComponent={
                        <ListItemsNotFound
                            text={`There are no songs in this playlist!`}
                            icon="music-note"
                        />
                    }
                    ListFooterComponent={
                        songData.length ? (
                            <View style={{ padding: Spacing.md }}>
                                <Text
                                    style={[
                                        textStyles.small,
                                        { textAlign: "center" },
                                    ]}
                                >
                                    {playlistData?.songs.length} songs{"  •  "}
                                    {CalculateTotalDuration(songData)}
                                </Text>
                            </View>
                        ) : null
                    }
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + Spacing.miniPlayer,
                    }}
                    renderItem={({ item, index }) => (
                        <SongListItem
                            item={item}
                            index={index}
                            showImage={true}
                            onLongPress={() => {
                                setSelectedSong(item);
                                openSongOptions();
                            }}
                            onPress={() => {
                                addListToQueue(songData, item, true);
                            }}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
            <SongSheet ref={SongOptionsRef} dismiss={dismissSongOptions} />
            <PlaylistSheet
                ref={PlaylistOptionsRef}
                dismiss={dismissPlaylistOptions}
            />
        </ScrollView>
    );
}
