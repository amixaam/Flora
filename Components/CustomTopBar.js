import { View, Text, TouchableNativeFeedback } from "react-native";
import React, { useRef } from "react";
import { mainStyles } from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CreatePlaylistBottomSheet from "./BottomSheets/CreatePlaylistBottomSheet";
import EditPlaylistOptionsBottomSheet from "./BottomSheets/EditPlaylistOptionsBottomSheet";

const CustomTopBar = ({
    addPlaylist = false,
    editPlaylist = false,
    settings = true,
}) => {
    const { top } = useSafeAreaInsets();

    const settingsSheetRef = useRef(null);
    const presentSettings = () => settingsSheetRef.current.present();

    const createPlaylistSheetRef = useRef(null);
    const createPlaylistPress = () => createPlaylistSheetRef.current.present();

    const editPlaylistSheetRef = useRef(null);
    const editPlaylistPress = () => editPlaylistSheetRef.current.present();
    return (
        <>
            <View style={[{ paddingTop: top + 8 }, mainStyles.topbarContainer]}>
                <Text style={mainStyles.topBarText}>Flora</Text>
                <View>
                    {addPlaylist && (
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
            <EditPlaylistOptionsBottomSheet ref={editPlaylistSheetRef} />
        </>
    );
};

export default CustomTopBar;
