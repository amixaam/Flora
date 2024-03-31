import { Link, Stack, router } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../state/songs";

function PlaylistList() {
    const { playlists } = useSongsStore();

    return (
        <View style={{ height: "100%" }}>
            <FlashList
                data={playlists}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ padding: 16 }}
                        onLongPress={() => router.push("/modal")}
                    >
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                estimatedItemSize={100}
            />
        </View>
    );
}

export default function PlaylistsTab() {
    return (
        <View>
            <PlaylistList />
        </View>
    );
}
