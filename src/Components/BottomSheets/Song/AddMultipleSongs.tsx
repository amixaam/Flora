import { forwardRef, useCallback, useRef } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import { SheetModalLayout } from "../SheetModalLayout";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Playlist, Song } from "../../../types/song";
import CreatePlaylist from "../Playlist/CreatePlaylist";
import ListItemsNotFound from "../../UI/Text/ListItemsNotFound";
import SheetOptionsButton from "../../UI/Buttons/SheetOptionsButton";
import SheetPlaylistOptionsButton from "../../UI/Buttons/SheetPlaylistOptionsButton";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { FlatList } from "react-native-gesture-handler";
import Pluralize from "../../../utils/Pluralize";
import MainButton from "../../UI/Buttons/MainButton";
import { View } from "react-native";
import { BottomSheetProps } from "../../../types/other";

interface AddMultipleSongsProps extends BottomSheetProps {
    songs: Song["id"][];
}

const AddMultipleSongs = forwardRef<BottomSheetModal, AddMultipleSongsProps>(
    (props, ref) => {
        const { playlists, addSongToPlaylist } = useSongsStore();

        const {
            sheetRef: CreatePlaylistRef,
            open: openCreatePlaylist,
            close: dismissCreatePlaylist,
        } = useBottomSheetModal();

        const addToPlaylist = (playlist: Playlist) => {
            if (props.songs.length === 0) return;

            addSongToPlaylist(playlist.id, props.songs);

            props.dismiss();
        };

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={`Choose a playlist`}
                    snapPoints={[SnapPoints.lg]}
                >
                    <FlatList
                        data={playlists}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={
                            <BottomSheetView
                                style={{
                                    gap: Spacing.md,
                                    alignItems: "center",
                                }}
                            >
                                <ListItemsNotFound text="No playlists found!" />
                                <MainButton
                                    onPress={openCreatePlaylist}
                                    type="secondary"
                                    text="Make a new playlist"
                                />
                            </BottomSheetView>
                        }
                        ListFooterComponent={
                            <SheetOptionsButton
                                icon="plus"
                                buttonContent="Make a new playlist"
                                onPress={openCreatePlaylist}
                            />
                        }
                        renderItem={({ item }) => (
                            <SheetPlaylistOptionsButton
                                playlist={item}
                                onPress={() => {
                                    addToPlaylist(item);
                                }}
                                isDisabled={props.songs.length === 0}
                            />
                        )}
                    />
                </SheetModalLayout>
                <CreatePlaylist
                    ref={CreatePlaylistRef}
                    dismiss={dismissCreatePlaylist}
                />
            </>
        );
    }
);

export default AddMultipleSongs;
