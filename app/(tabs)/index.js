import { Link, Stack, router } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../store/songs";
import { useEffect, useRef } from "react";
import EditPlaylistBottomSheet from "../../Components/BottomSheets/EditPlaylistBottomSheet";
import { Poppins_600SemiBold, useFonts } from "@expo-google-fonts/poppins";

const PlaylistItem = ({ item }, handleOpenPress, setSelectedPlaylist) => {
    const handleLongPress = () => {
        setSelectedPlaylist(item);
        handleOpenPress();
    };
    return (
        <TouchableOpacity
            style={{
                margin: 4,
            }}
            onPress={() => router.push("/(playlist)/" + item.id)}
            onLongPress={handleLongPress}
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
    );
};

export default function PlaylistsTab() {
    const { playlists, setSelectedPlaylist } = useSongsStore();
    useEffect(() => {
        console.log("playlists renew");
    }, []);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    let [fontsLoaded, fontError] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={{ padding: 16 }}>
            <Text
                style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 24,
                }}
            >
                Greeting message!
            </Text>
            <View style={{ height: "100%" }}>
                <FlashList
                    numColumns={2}
                    data={playlists}
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={100}
                    renderItem={({ item }) =>
                        PlaylistItem(
                            { item },
                            handleOpenPress,
                            setSelectedPlaylist
                        )
                    }
                />
            </View>
            <EditPlaylistBottomSheet ref={bottomSheetRef} />
        </View>
    );
}
