import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AlbumArt from "../../../Components/AlbumArt";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import SongSheet from "../../../Components/BottomSheets/SongSheet";
import ImageBlurBackground from "../../../Components/ImageBlurBackground";
import SongListItem from "../../../Components/SongListItem";
import PrimaryRoundIconButton from "../../../Components/UI/PrimaryRoundIconButton";
import SecondaryRoundIconButton from "../../../Components/UI/SecondaryRoundIconButton";
import { useSongsStore } from "../../../store/songs";
import { FormatSecs } from "../../../utils/FormatMillis";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import MiniPlayer from "../../../Components/MiniPlayer";
import { colors } from "../../../styles/constants";
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
        currentTrack,
        loadTrack,
        getSongDataFromPlaylist,
    } = useSongsStore();

    const playlistData = getPlaylist(id);
    const songData = getSongDataFromPlaylist(id);

    const editSongSheetRef = useRef(null);
    const handleEditSong = () => editSongSheetRef.current.present();

    const editPlaylistSheetRef = useRef(null);
    const handleEditPlaylist = () => editPlaylistSheetRef.current.present();

    const handleShufflePress = () => {
        const randomSongIndex = Math.floor(Math.random() * songData.length);
        loadTrack(songData[randomSongIndex], playlistData, true);
    };

    const handlePlayPress = () => {
        loadTrack(songData[0], playlistData, false);
    };

    return (
        <View style={mainStyles.container}>
            <ScrollView style={mainStyles.container}>
                <ImageBlurBackground
                    image={playlistData.image}
                    styles={{ height: 360 }}
                />
                <View
                    style={{
                        padding: 16,
                        alignItems: "center",
                        rowGap: 8,
                    }}
                >
                    <AlbumArt
                        image={playlistData.image}
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
                            onPress={handlePlayPress}
                            icon="play"
                        />
                        <PrimaryRoundIconButton
                            size={36}
                            onPress={handleShufflePress}
                        />
                        <SecondaryRoundIconButton
                            icon="pencil"
                            onPress={handleEditPlaylist}
                        />
                    </View>
                </View>
                {playlistData.songs.length === 0 && (
                    <View
                        style={{
                            marginTop: 32,
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <MaterialCommunityIcons
                            name="playlist-remove"
                            size={48}
                            style={{ color: colors.primary }}
                        />
                        <Text
                            style={[
                                textStyles.text,
                                { textAlign: "center", width: "75%" },
                            ]}
                        >
                            Add songs to this playlist by holding the song you
                            want and selecting this playlist!
                        </Text>
                    </View>
                )}
                <View style={{ flex: 1, minHeight: 5 }}>
                    <FlashList
                        data={songData}
                        estimatedItemSize={100}
                        renderItem={({ item, index }) => (
                            <SongListItem
                                item={item}
                                index={index}
                                addSongLike={addSongLike}
                                removeSongLike={removeSongLike}
                                handleOpenPress={handleEditSong}
                                setSelectedSong={setSelectedSong}
                                isCurrentTrack={
                                    item.id === currentTrack ? true : false
                                }
                                showNumeration={
                                    playlistData.id == 1 ? false : true
                                }
                                showImage={playlistData.id == 1 ? true : false}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                {playlistData.songs.length > 0 && (
                    <View style={{ padding: 16, paddingBottom: 64 }}>
                        <Text
                            style={[textStyles.small, { textAlign: "center" }]}
                        >
                            {playlistData.songs.length} songs{"  •  "}
                            {CalculateTotalDuration(songData)}
                        </Text>
                    </View>
                )}
                <SongSheet ref={editSongSheetRef} />
                <PlaylistSheet ref={editPlaylistSheetRef} />
            </ScrollView>
            <MiniPlayer />
        </View>
    );
}
