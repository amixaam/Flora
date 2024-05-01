import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import { spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { FormatSecs } from "../../../utils/FormatMillis";

const CalculateTotalDuration = (songs) => {
    let totalDuration = 0;
    songs.forEach((song) => {
        totalDuration += song.duration;
    });
    return FormatSecs(totalDuration);
};

export default function PlaylistScreen() {
    const { id } = useLocalSearchParams();
    const {
        getPlaylist,
        addSongLike,
        removeSongLike,
        setSelectedSong,
        getSongDataFromPlaylist,
        shuffleList,
        addListToQueue,
    } = useSongsStore();

    // const navigation = useNavigation();
    // useEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <IconButton icon="pencil" onPress={handleEditPlaylist} />
    //         ),
    //     });
    // }, [navigation]);

    const playlistData = getPlaylist(id);
    const songData = getSongDataFromPlaylist(id);

    const editSongSheetRef = useRef(null);
    const handleEditSong = () => editSongSheetRef.current.present();

    const editPlaylistSheetRef = useRef(null);
    const handleEditPlaylist = () => editPlaylistSheetRef.current.present();

    const handleShufflePress = () => {};

    const handlePlayPress = () => {};
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[mainStyles.container]}>
            <ImageBlurBackground
                image={playlistData.artwork}
                styles={{ height: 520 }}
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
                    image={playlistData.artwork}
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
                        {playlistData.name}
                    </Text>
                    {playlistData.description && (
                        <Text
                            style={[
                                textStyles.text,
                                { textAlign: "center", opacity: 0.7 },
                            ]}
                        >
                            {playlistData.description}
                        </Text>
                    )}
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
                        onPress={() => addListToQueue(songData, null, true)}
                        icon="play"
                    />
                    <PrimaryRoundIconButton
                        size={36}
                        onPress={() => shuffleList(songData, true)}
                    />
                    <SecondaryRoundIconButton
                        icon="pencil"
                        onPress={handleEditPlaylist}
                    />
                </View>
            </View>
            <View style={{ flex: 1, minHeight: 5 }}>
                <FlashList
                    data={songData}
                    estimatedItemSize={100}
                    ListEmptyComponent={
                        <ListItemsNotFound
                            text={`There are no songs in this playlist!`}
                            icon="music-note"
                        />
                    }
                    ListFooterComponent={
                        songData.length ? (
                            <View style={{ padding: spacing.md }}>
                                <Text
                                    style={[
                                        textStyles.small,
                                        { textAlign: "center" },
                                    ]}
                                >
                                    {playlistData.songs.length} songs{"  •  "}
                                    {CalculateTotalDuration(songData)}
                                </Text>
                            </View>
                        ) : null
                    }
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + spacing.miniPlayer,
                    }}
                    renderItem={({ item, index }) => (
                        <SongListItem
                            item={item}
                            index={index}
                            handleOpenPress={handleEditSong}
                            onPress={() => {
                                addListToQueue(songData, item, true);
                            }}
                            showNumeration={
                                playlistData.type == "Album" ? false : true
                            }
                            showImage={
                                playlistData.type == "Album" ? true : false
                            }
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <SongSheet ref={editSongSheetRef} />
            <PlaylistSheet ref={editPlaylistSheetRef} />
        </ScrollView>
    );
}
