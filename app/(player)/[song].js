import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useEffect, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";

import AlbumArt from "../../Components/AlbumArt";
import SongSheet from "../../Components/BottomSheets/SongSheet";
import ImageBlurBackground from "../../Components/ImageBlurBackground";
import PlaybackControls from "../../Components/PlaybackControls";
import IconButton from "../../Components/UI/IconButton";
import PrimaryRoundIconButton from "../../Components/UI/PrimaryRoundIconButton";
import { mainStyles, textStyles } from "../../Components/styles";

export default function PlayerTab() {
    const { song } = useLocalSearchParams();
    const {
        currentTrack,
        playlist,
        selectedPlaylist,
        setSelectedSong,
        getSong,
        loadTrack,
        addSongLike,
        removeSongLike,
    } = useSongsStore();

    const [songData, setSongData] = useState(() => getSong(song));
    useEffect(() => {
        setSongData(getSong(currentTrack));
    }, [currentTrack]);

    useEffect(() => {
        if (
            songData.id !== currentTrack ||
            selectedPlaylist.id !== playlist.id
        ) {
            loadTrack(songData, selectedPlaylist);
        }
    }, []);

    const handleLikeButtonPress = () => {
        if (songData && currentTrack) {
            if (songData.isLiked) {
                removeSongLike(songData.id);
                songData.isLiked = false;
            } else {
                addSongLike(songData.id);
                songData.isLiked = true;
            }
        }
    };

    const SongSheetRef = useRef(null);
    const handleEditSong = () => {
        setSelectedSong(songData);
        SongSheetRef.current.present();
    };

    return (
        <View style={[mainStyles.container]}>
            <ImageBlurBackground image={songData ? songData.image : null} />
            <View
                style={{
                    justifyContent: "center",
                    padding: 32,
                    rowGap: 16,
                    flex: 1,
                }}
            >
                <View>
                    <AlbumArt
                        image={songData ? songData.image : null}
                        style={{
                            width: "100%",
                            aspectRatio: 1,
                            borderRadius: 7,
                        }}
                    />
                    <PrimaryRoundIconButton
                        icon="pencil"
                        onPress={handleEditSong}
                        style={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                        }}
                    />
                </View>
                <View style={{ rowGap: 4, marginBottom: 32 }}>
                    <View style={styles.titleContainer}>
                        <Text style={textStyles.h4} numberOfLines={1}>
                            {songData && songData.name
                                ? songData.name
                                : "No name"}
                        </Text>
                        <IconButton
                            onPress={handleLikeButtonPress}
                            icon={
                                songData && songData.isLiked
                                    ? "heart"
                                    : "heart-outline"
                            }
                        />
                    </View>

                    <Text
                        style={[
                            textStyles.text,
                            { textAlign: "center", opacity: 0.7 },
                        ]}
                    >
                        {songData && songData.artist
                            ? songData.artist
                            : "No artist"}
                        {"  •  "}
                        {songData && songData.date ? songData.date : "No date"}
                    </Text>
                </View>
                <PlaybackControls />
            </View>
            <SongSheet ref={SongSheetRef} />
        </View>
    );
}

const styles = StyleSheet.create({
    playerContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 32,
        rowGap: 16,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 16,
    },
    GradientContainer: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 7,
        alignItems: "flex-end",
        paddingTop: 10,
        paddingEnd: 8,
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
    },
    centerText: {
        textAlign: "center",
    },
});
