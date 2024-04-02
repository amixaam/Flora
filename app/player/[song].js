import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useSongsStore } from "../../store/songs";
import useAudioStore from "../../store/audio";

function PlaybackControls({ isPlaying, toggleIsPlaying }) {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <TouchableOpacity
                style={{ padding: 16 }}
                onPress={() => toggleIsPlaying()}
            >
                <MaterialIcons
                    name={isPlaying ? "pause" : "play-arrow"}
                    size={64}
                />
            </TouchableOpacity>
        </View>
    );
}

export default function PlayerTab() {
    const { song } = useLocalSearchParams();
    const { getSong, setLikeSong, setUnlikeSong } = useSongsStore();
    const { setSong, toggleIsPlaying, isPlaying } = useAudioStore();

    const songData = getSong(song);
    console.log(isPlaying);

    return (
        <View style={{ padding: 16, paddingHorizontal: 32 }}>
            <View
                style={{
                    width: "100%",
                    aspectRatio: 1,
                    backgroundColor: "gray",
                    borderRadius: 7,
                }}
            />
            <Text>{songData.name}</Text>
            <PlaybackControls
                isPlaying={isPlaying}
                toggleIsPlaying={toggleIsPlaying}
            />
        </View>
    );
}
