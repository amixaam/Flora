import { useLocalSearchParams } from "expo-router";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useEffect, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { LinearGradient } from "expo-linear-gradient";
import AlbumArt from "../../Components/AlbumArt";
import EditSongBottomSheet from "../../Components/BottomSheets/EditSongBottomSheet";
import PlaybackControls from "../../Components/PlaybackControls";
import PrimaryRoundIconButton from "../../Components/UI/PrimaryRoundIconButton";
import { mainStyles, textStyles } from "../../Components/styles";
import ImageBlurBackground from "../../Components/ImageBlurBackground";

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

    const editSongBottomSheetRef = useRef(null);
    const handleEditSong = () => {
        setSelectedSong(songData);
        editSongBottomSheetRef.current.present();
    };

    return (
        <View style={[mainStyles.container]}>
            <ImageBlurBackground image={playlist.image} />
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
                        image={playlist.image}
                        width={"100%"}
                        aspectRatio={1}
                        borderRadius={7}
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
                        <TouchableOpacity onPress={handleLikeButtonPress}>
                            <MaterialCommunityIcons
                                name={
                                    songData && songData.isLiked
                                        ? "heart"
                                        : "heart-outline"
                                }
                                size={24}
                                style={mainStyles.color_text}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text
                        style={[
                            textStyles.text,
                            { textAlign: "center", opacity: 0.7 },
                        ]}
                    >
                        {songData && songData.author
                            ? songData.author
                            : "No author"}
                        ,{" "}
                        {songData && songData.date ? songData.date : "No date"}
                    </Text>
                </View>
                <PlaybackControls />
            </View>
            <EditSongBottomSheet ref={editSongBottomSheetRef} />
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
