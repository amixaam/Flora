import React, { useRef } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mainStyles, textStyles } from "./styles";

import { router, usePathname } from "expo-router";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CreatePlaylistBottomSheet from "./BottomSheets/CreatePlaylistBottomSheet";
import PlaylistSheet from "./BottomSheets/PlaylistSheet";

const CustomTopBar = ({ editPlaylist = false, backButton = false }) => {
    const { top } = useSafeAreaInsets();
    const pathname = usePathname();

    const getHeaderText = () => {
        if (pathname === "/local") {
            return "Songs";
        } else if (pathname === "/") {
            return "Playlists";
        } else if (pathname === "/ytmp3") {
            return "YTmp3";
        } else {
            return "";
        }
    };

    const settingsSheetRef = useRef(null);
    const presentSettings = () => settingsSheetRef.current.present();

    const createPlaylistSheetRef = useRef(null);
    const createPlaylistPress = () => createPlaylistSheetRef.current.present();

    const editPlaylistSheetRef = useRef(null);
    const editPlaylistPress = () => editPlaylistSheetRef.current.present();
    return (
        <>
            <View style={[{ paddingTop: top + 8 }, mainStyles.topbarContainer]}>
                {backButton && (
                    <TouchableNativeFeedback onPress={() => router.back()}>
                        <View style={mainStyles.roundButton}>
                            <MaterialCommunityIcons
                                name="arrow-left"
                                style={mainStyles.color_text}
                                size={24}
                            />
                        </View>
                    </TouchableNativeFeedback>
                )}
                <Text style={textStyles.h3}>{getHeaderText()}</Text>
                <View>
                    {pathname === "/" && (
                        <TouchableNativeFeedback onPress={createPlaylistPress}>
                            <View style={mainStyles.roundButton}>
                                <MaterialCommunityIcons
                                    name="plus"
                                    style={mainStyles.color_text}
                                    size={24}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    {editPlaylist && (
                        <TouchableNativeFeedback onPress={editPlaylistPress}>
                            <View style={mainStyles.roundButton}>
                                <MaterialCommunityIcons
                                    name="pencil"
                                    style={mainStyles.color_text}
                                    size={24}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    )}
                </View>
            </View>
            <CreatePlaylistBottomSheet ref={createPlaylistSheetRef} />
            <PlaylistSheet ref={editPlaylistSheetRef} />
        </>
    );
};

export default CustomTopBar;
