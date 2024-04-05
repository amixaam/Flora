import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useSongsStore } from "../../store/songs";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import PlaybackControls from "../../Components/PlaybackControls";

export default function PlayerTab() {
    const { song } = useLocalSearchParams();
    const {
        getSong,
        selectedPlaylist,
        loadTrack,
        currentTrack,
        addSongLike,
        removeSongLike,
    } = useSongsStore();

    const songData = getSong(song);

    useEffect(() => {
        if (songData !== currentTrack) {
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
        <View style={styles.playerContainer}>
            <LinearGradient
                style={styles.GradientContainer}
                colors={["pink", "lightblue"]}
                start={{ x: -0.5, y: 0 }}
                end={{ x: 1, y: 1.5 }}
            ></LinearGradient>
            <View style={{ marginBottom: 8 }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.boldText} numberOfLines={1}>
                        {currentTrack.name ? currentTrack.name : "No name"}
                    </Text>
                    <TouchableOpacity onPress={handleLikeButtonPress}>
                        <MaterialIcons
                            name={
                                currentTrack.isLiked
                                    ? "favorite"
                                    : "favorite-border"
                            }
                            size={24}
                            color="red"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.centerText}>
                    {currentTrack.author ? currentTrack.author : "No author"},{" "}
                    {currentTrack.date ? currentTrack.date : "No date"}
                </Text>
            </View>
            <PlaybackControls />
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
