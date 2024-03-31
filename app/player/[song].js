import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";
const soundObject = new Audio.Sound();

async function loadMusic(id) {
    const musicAsset = await MediaLibrary.getAssetInfoAsync(id);
    // console.log(musicAsset);

    await soundObject.loadAsync({ uri: musicAsset.uri });
    await soundObject.playAsync();
}

export default function PlayerTab() {
    const { song } = useLocalSearchParams();
    loadMusic(song);
    return (
        <View>
            <Text>Player</Text>
            <Text>{song}</Text>

            <TouchableOpacity
                style={{ padding: 16 }}
                onPress={() => soundObject.stopAsync()}
            >
                <Text>Toggle</Text>
            </TouchableOpacity>
        </View>
    );
}
