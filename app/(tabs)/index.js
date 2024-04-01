import { Link, Stack, router } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../store/songs";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

function PlaylistList({ playlists }) {
    return (
        <View style={{ height: "100%" }}>
            <FlashList
                numColumns={2}
                data={playlists}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            margin: 4,
                        }}
                    >
                        <View
                            style={{
                                marginBottom: 8,
                                width: "100%",
                                aspectRatio: 1,
                                borderRadius: 7,
                                backgroundColor: "gray",
                            }}
                        ></View>
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                        <Text>{item.songs.length} songs</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                estimatedItemSize={100}
            />
        </View>
    );
}

export default function PlaylistsTab() {
    const { playlists } = useSongsStore();
    useEffect(() => {
        console.log("playlists renew");
    }, []);
    return (
        <View style={{ padding: 16 }}>
            <Text>Greeting msg!</Text>
            {/* <Text>{JSON.stringify(playlists)}</Text> */}
            <PlaylistList playlists={playlists} />
        </View>
    );
}
