import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useSongsStore } from "../../store/songs";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import PlaybackControls from "../../Components/PlaybackControls";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AlbumArt from "../../Components/AlbumArt";

import { BlurView } from "expo-blur";

export default function PlayerTab() {
    const { song } = useLocalSearchParams();
    const {
        getSong,
        selectedPlaylist,
        loadTrack,
        currentTrack,
        addSongLike,
        removeSongLike,
        playlist,
    } = useSongsStore();

    const songData = getSong(song);

    useEffect(() => {
        if (songData.id !== currentTrack.id) {
            loadTrack(songData, selectedPlaylist);
        }
    }, []);

    const handleLikeButtonPress = () => {
        if (currentTrack) {
            if (currentTrack.isLiked) removeSongLike(currentTrack.id);
            else addSongLike(currentTrack.id);
        }
    };

    return (
        <>
            <AlbumArt
                image={playlist.image}
                width={"100%"}
                height={"45%"}
                position={"absolute"}
            />

            <BlurView
                style={styles.playerContainer}
                blurReductionFactor={1}
                intensity={40}
                experimentalBlurMethod="dimezisBlurView"
            >
                <AlbumArt
                    image={playlist.image}
                    width={"100%"}
                    aspectRatio={1}
                    borderRadius={7}
                />
                <View style={{ marginBottom: 8 }}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.boldText} numberOfLines={1}>
                            {currentTrack.name ? currentTrack.name : "No name"}
                        </Text>
                        <TouchableOpacity onPress={handleLikeButtonPress}>
                            <MaterialCommunityIcons
                                name={
                                    currentTrack.isLiked
                                        ? "heart"
                                        : "heart-outline"
                                }
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.centerText}>
                        {currentTrack.author
                            ? currentTrack.author
                            : "No author"}
                        , {currentTrack.date ? currentTrack.date : "No date"}
                    </Text>
                </View>
                <PlaybackControls />
            </BlurView>
        </>
    );
}

const styles = StyleSheet.create({
    playerContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 32,
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
