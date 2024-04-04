import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from "react-native";
import { forwardRef, useCallback, useMemo } from "react";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import { FlashList } from "@shopify/flash-list";

const AddSongToPlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    const { selectedSong, getPlaylistsFromSongID, addSongToPlaylist } =
        useSongsStore();

    const playlists = useMemo(
        () => getPlaylistsFromSongID(selectedSong.id),
        [selectedSong]
    );

    const handleDismissPress = () => {
        ref.current.dismiss();
    };

    return (
        <BottomSheetModal
            ref={ref}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{
                borderRadius: 50,
            }}
            backdropComponent={renderBackdrop}
        >
            <BottomSheetView style={{ paddingHorizontal: 16 }}>
                <BottomSheetView style={styles.sheetHeader}>
                    <Text style={styles.headerText}>Save song to playlist</Text>
                </BottomSheetView>
                <BottomSheetView style={{ height: "100%" }}>
                    {playlists.length === 0 && (
                        <Text
                            style={{ textAlign: "center", paddingVertical: 8 }}
                        >
                            No new playlists
                        </Text>
                    )}
                    <FlashList
                        data={playlists}
                        renderItem={({ item }) =>
                            PlaylistListItem(
                                { item },
                                { selectedSong },
                                addSongToPlaylist,
                                handleDismissPress
                            )
                        }
                        estimatedItemSize={50}
                        keyExtractor={(item) => item.id}
                    />
                </BottomSheetView>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const PlaylistListItem = (
    { item },
    { selectedSong },
    addSongToPlaylist,
    handleDismissPress
) => {
    return (
        <TouchableNativeFeedback
            onPress={() => {
                addSongToPlaylist(item.id, selectedSong.id);
                handleDismissPress();
            }}
        >
            <View style={styles.listItem}>
                <BottomSheetView style={styles.playlistIcon} />
                <Text>{item.name}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

const styles = StyleSheet.create({
    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "lightgray",
        width: "100%",
        paddingBottom: 4,
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    listItem: {
        flexDirection: "row",
        columnGap: 16,
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    playlistIcon: {
        height: 64,
        aspectRatio: 1,
        borderRadius: 4,
        backgroundColor: "gray",
    },
});

export default AddSongToPlaylistBottomSheet;
