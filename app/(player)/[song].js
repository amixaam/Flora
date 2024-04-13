import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";

import { useSongsStore } from "../../store/songs";
import { useEffect } from "react";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PlaybackControls from "../../Components/PlaybackControls";
import AlbumArt from "../../Components/AlbumArt";
import Animated, { FadeInDown } from "react-native-reanimated";
import { mainStyles } from "../../Components/styles";

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

    // TODO: try linear gradient
    return (
        <View style={mainStyles.container}>
            <AlbumArt
                image={playlist.image}
                width={"100%"}
                height={"80%"}
                position={"absolute"}
            />
            <BlurView
                style={styles.playerContainer}
                tint="dark"
                intensity={70}
                blurReductionFactor={1}
                experimentalBlurMethod="dimezisBlurView"
                entering={FadeInDown.duration(300)}
            >
                <View>
                    <AlbumArt
                        image={playlist.image}
                        width={"100%"}
                        aspectRatio={1}
                        borderRadius={7}
                    />
                </View>
                <Animated.View
                    style={{ marginBottom: 8 }}
                    entering={FadeInDown.duration(200)}
                >
                    <View style={styles.titleContainer}>
                        <Text style={mainStyles.text_24} numberOfLines={1}>
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
                                style={mainStyles.color_text}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[mainStyles.text_12, { textAlign: "center" }]}>
                        {currentTrack.author
                            ? currentTrack.author
                            : "No author"}
                        , {currentTrack.date ? currentTrack.date : "No date"}
                    </Text>
                </Animated.View>
                <PlaybackControls />
            </BlurView>
        </View>
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
