import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useSongsStore } from "../../store/songs";

function listItem({ item }, setLikeSong, setUnlikeSong) {
    return (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push("/" + item.id)}
        >
            <Text>{item.name}</Text>
            <TouchableOpacity
                onPress={() =>
                    item.isLiked ? setUnlikeSong(item.id) : setLikeSong(item.id)
                }
            >
                <MaterialIcons
                    name={item.isLiked ? "favorite" : "favorite-border"}
                    size={24}
                    color="red"
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

export default function LocalFilesTab() {
    const { songs, setSongs, setLikeSong, setUnlikeSong } = useSongsStore();

    // process new songs
    useEffect(() => {
        console.log("local renew");
        (async () => {
            // get permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access media library was denied");
                return;
            }
            // get audio assets
            const { assets } = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio,
            });

            // check if there are new songs
            const newSongs = assets.filter(
                (asset) => !songs.some((song) => song.id === asset.id)
            );

            // process new songs
            const newSongsWithInfo = newSongs.map((asset) => {
                return {
                    uri: asset.uri,
                    filename: asset.filename,
                    id: asset.id,
                    name: asset.filename, //default
                    author: null,
                    date: null,
                    duration: asset.duration,
                    isLiked: false,
                    isHidden: false,
                    lastPlayed: null,
                    timesPlayed: 0,
                };
            });

            // append new songs
            setSongs([...songs, ...newSongsWithInfo]);
        })();
    }, []);

    return (
        <View
            style={{
                height: Dimensions.get("window").height,
            }}
        >
            {/* <Text>{JSON.stringify(songs[0])}</Text> */}
            <FlashList
                data={songs}
                estimatedItemSize={80} // Adjust based on your item size
                renderItem={({ item }) =>
                    listItem({ item }, setLikeSong, setUnlikeSong)
                }
                keyExtractor={(item) => item.id} // Ensure unique keys
            />
        </View>
    );
}
const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});
