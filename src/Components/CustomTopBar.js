import { router, useSegments } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import CreatePlaylistBottomSheet from "./BottomSheets/CreatePlaylistBottomSheet";
import PlaylistSheet from "./BottomSheets/PlaylistSheet";
import SecondaryRoundIconButton from "./UI/SecondaryRoundIconButton";
import TextInput from "./UI/TextInput";
import SearchBar from "./UI/SearchBar";

const CustomTopBar = () => {
    const { top } = useSafeAreaInsets();
    const pathname = useSegments();

    const [options, setOptions] = useState({
        createPlaylist: true,
        editSong: false,
        editPlaylist: false,
        backButton: false,
        searchBar: false,
    });
    const [header, setHeader] = useState("s");
    const [searchQuery, setSearchQuery] = useState("");
    const queryItems = (query) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        getHeaderText();
    }, [pathname]);

    const getHeaderText = () => {
        if (pathname[1] === "(playlists)") {
            if (pathname[2] === "[id]") {
                setOptions({
                    backButton: true,
                    editPlaylist: true,
                });
                setHeader("");
                return;
            }
            setOptions({
                createPlaylist: true,
            });
            setHeader("Playlists");
            return "Playlists";
        } else if (pathname[1] === "local") {
            setOptions({ searchBar: true });
            setHeader("");
            return;
        } else {
            setOptions({});
            setHeader(pathname);
            return;
        }
    };

    const createPlaylistSheetRef = useRef(null);
    const createPlaylistPress = () => createPlaylistSheetRef.current.present();

    const editPlaylistSheetRef = useRef(null);
    const editPlaylistPress = () => editPlaylistSheetRef.current.present();
    return (
        <View
            style={[
                { paddingTop: top + spacing.sm },
                mainStyles.topbarContainer,
            ]}
        >
            {options.searchBar && <SearchBar value={searchQuery} />}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {options.backButton && (
                    <View>
                        <SecondaryRoundIconButton
                            icon="arrow-left"
                            onPress={() => router.back()}
                        />
                    </View>
                )}
                <Text style={[textStyles.h3, header ? {} : { opacity: 0 }]}>
                    {header ? header : "L"}
                </Text>
                <View>
                    {options.createPlaylist && (
                        <SecondaryRoundIconButton
                            icon="plus"
                            onPress={createPlaylistPress}
                        />
                    )}
                    {options.editPlaylist && (
                        <SecondaryRoundIconButton
                            icon="pencil"
                            onPress={editPlaylistPress}
                        />
                    )}
                </View>
            </View>
            <CreatePlaylistBottomSheet ref={createPlaylistSheetRef} />
            <PlaylistSheet ref={editPlaylistSheetRef} />
        </View>
    );
};

export default CustomTopBar;
