import { Button, Text, TextInput, View } from "react-native";
import { useSongsStore } from "../store/songs";
import { useState } from "react";
export default function Modal() {
    const { createPlaylist } = useSongsStore();
    const [name, setName] = useState("");

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text>Add a playlist</Text>
            <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Playlist name"
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            />
            <Button title="Add" onPress={() => createPlaylist(name)} />
        </View>
    );
}
