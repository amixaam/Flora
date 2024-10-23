import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";
import AddMultipleSongs from "../../Components/BottomSheets/Song/AddMultipleSongs";
import SongSheet from "../../Components/BottomSheets/Song/SongSheet";
import IconButton from "../../Components/UI/Buttons/IconButton";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";
import SongItem from "../../Components/UI/UI chunks/SongItem";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import useBottomSheetModal from "../../hooks/useBottomSheetModal";
import useMultiSelect from "../../hooks/useMultiSelect";
import { useSongsStore } from "../../store/songsStore";
import { Colors } from "../../styles/constants";
import { Song } from "../../types/song";

const HistoryScreen = () => {
    const { history, getSong, setSelectedSong, addToQueueFirst } =
        useSongsStore();

    const {
        sheetRef: SongRef,
        open: openSong,
        close: dismissSong,
    } = useBottomSheetModal();

    const { sheetRef, open, close } = useBottomSheetModal();

    const openSheet = async (song: Song) => {
        await setSelectedSong(song);
        openSong();
    };

    const onPress = (song: Song) => {
        if (multiselectMode) {
            toggle(song.id);
        } else {
            addToQueueFirst(song);
        }
    };

    const {
        multiselectMode,
        multiselectedItems,
        toggle,
        setSelection,
        deselectAll,
    } = useMultiSelect<Song["id"]>();

    return (
        <>
            <SwipeDownScreen
                header={
                    multiselectedItems.length > 0 ? (
                        <SheetHeader
                            title={`${multiselectedItems.length} selected`}
                            headerLeft={
                                <IconButton
                                    icon="close"
                                    onPress={deselectAll}
                                />
                            }
                            headerRight={
                                <SelectedMenuButton
                                    selectedSongs={multiselectedItems}
                                    selectAll={() => {
                                        setSelection(
                                            history.history.map(
                                                (item) => item.song
                                            )
                                        );
                                    }}
                                    openAddToPlaylist={open}
                                />
                            }
                        />
                    ) : (
                        <SheetHeader
                            title="History"
                            headerRight={
                                <MenuButton openAddToPlaylist={open} />
                            }
                        />
                    )
                }
            >
                <ScrollView>
                    {history.history.map((item) => {
                        const song = getSong(item.song);
                        if (!song) return null;

                        return (
                            <SongItem
                                key={song.id}
                                song={song}
                                isActive={
                                    multiselectMode &&
                                    multiselectedItems.includes(song.id)
                                }
                                onPress={() => {
                                    onPress(song);
                                }}
                                onLongPress={() => {
                                    toggle(song.id);
                                }}
                                controls={{
                                    onPress: () => {
                                        openSheet(song);
                                    },
                                }}
                            />
                        );
                    })}
                </ScrollView>
            </SwipeDownScreen>
            <SongSheet ref={SongRef} dismiss={dismissSong} />
            <AddMultipleSongs
                ref={sheetRef}
                dismiss={close}
                deselect={deselectAll}
                songs={
                    multiselectedItems.length > 0
                        ? multiselectedItems
                        : history.history.map((item) => item.song)
                }
            />
        </>
    );
};

const SelectedMenuButton = ({
    selectedSongs,
    selectAll,
    openAddToPlaylist,
}: {
    selectedSongs: Song["id"][];
    selectAll: () => void;
    openAddToPlaylist: () => void;
}) => {
    const [visible, setVisible] = useState(false);
    const { shuffleList, addToQueue, getSong } = useSongsStore();

    const getSelectedSongs = () => {
        return selectedSongs.map((id) => getSong(id) as Song);
    };

    return (
        <Menu
            visible={visible}
            contentStyle={{ backgroundColor: Colors.input }}
            anchorPosition="bottom"
            onDismiss={() => setVisible(false)}
            anchor={
                <IconButton
                    icon={"dots-vertical"}
                    onPress={() => setVisible(true)}
                />
            }
        >
            <Menu.Item
                onPress={() => {
                    shuffleList(getSelectedSongs());
                    setVisible(false);
                }}
                title="Shuffle"
                titleStyle={{ color: Colors.primary }}
            />
            <Menu.Item
                onPress={() => {
                    addToQueue(getSelectedSongs());
                    setVisible(false);
                }}
                title="Add to queue"
                titleStyle={{ color: Colors.primary }}
            />
            <Menu.Item
                onPress={() => {
                    openAddToPlaylist();
                    setVisible(false);
                }}
                title="Add to playlist"
                titleStyle={{ color: Colors.primary }}
            />
            <Menu.Item
                onPress={() => {
                    selectAll();
                    setVisible(false);
                }}
                title="Select all"
                titleStyle={{ color: Colors.primary }}
            />
        </Menu>
    );
};

const MenuButton = ({
    openAddToPlaylist,
}: {
    openAddToPlaylist: () => void;
}) => {
    const [visible, setVisible] = useState(false);

    const { getHistory, getSong, shuffleList, addToQueue } = useSongsStore();

    function getSongsFromHistory() {
        const history = getHistory().history;

        const songs: Song[] = history
            .map((historyItem) => {
                const song = getSong(historyItem.song);
                if (!song) return undefined;
                return song;
            })
            .filter((song) => song !== undefined) as Song[];

        return songs;
    }

    return (
        <Menu
            visible={visible}
            contentStyle={{ backgroundColor: Colors.input }}
            anchorPosition="bottom"
            onDismiss={() => setVisible(false)}
            anchor={
                <IconButton
                    icon={"dots-vertical"}
                    onPress={() => setVisible(true)}
                />
            }
        >
            <Menu.Item
                onPress={() => {
                    shuffleList(getSongsFromHistory());
                    setVisible(false);
                }}
                title="Shuffle"
                titleStyle={{ color: Colors.primary }}
            />
            <Menu.Item
                onPress={() => {
                    addToQueue(getSongsFromHistory());
                    setVisible(false);
                }}
                title="Add to queue"
                titleStyle={{ color: Colors.primary }}
            />
            <Menu.Item
                onPress={() => {
                    openAddToPlaylist();
                    setVisible(false);
                }}
                title="Add to playlist"
                titleStyle={{ color: Colors.primary }}
            />
        </Menu>
    );
};

export default HistoryScreen;
