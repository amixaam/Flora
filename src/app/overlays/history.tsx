import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";
import SongSheet from "../../Components/BottomSheets/Song/SongSheet";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import useBottomSheetModal from "../../hooks/useBottomSheetModal";
import { useSongsStore } from "../../store/songs";
import { Colors } from "../../styles/constants";
import { Song } from "../../types/song";
import IconButton from "../../Components/UI/Buttons/IconButton";
import SongItem from "../../Components/UI/UI chunks/SongItem";
import AddMultipleSongs from "../../Components/BottomSheets/Song/AddMultipleSongs";

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
            toggleSelectedSong(song.id);
        } else {
            addToQueueFirst(song);
        }
    };

    const onLongPress = (id: Song["id"]) => {
        toggleSelectedSong(id);
    };

    // multiselect
    const [multiselectedSongs, setMultiselectedSongs] = useState<Song["id"][]>(
        []
    );
    const [multiselectMode, setMultiselectMode] = useState(false);

    useEffect(() => {
        if (multiselectedSongs.length == 0) {
            setMultiselectMode(false);
        } else {
            setMultiselectMode(true);
        }
    }, [multiselectedSongs]);

    const toggleSelectedSong = (id: Song["id"]) => {
        if (multiselectedSongs.includes(id)) {
            setMultiselectedSongs(multiselectedSongs.filter((s) => s !== id));
        } else {
            setMultiselectedSongs([...multiselectedSongs, id]);
        }
    };

    const removeAllSelectedSongs = () => {
        setMultiselectedSongs([]);
    };

    const selectAllSongs = () => {
        const songs = history.history.map((item) => getSong(item.song) as Song);
        setMultiselectedSongs(songs.map((song) => song.id));
    };

    return (
        <>
            <SwipeDownScreen>
                {multiselectedSongs.length > 0 ? (
                    <SheetHeader
                        title={`${multiselectedSongs.length} selected`}
                        headerLeft={
                            <IconButton
                                icon="close"
                                touchableOpacityProps={{
                                    onPress: removeAllSelectedSongs,
                                }}
                            />
                        }
                        headerRight={
                            <SelectedMenuButton
                                selectedSongs={multiselectedSongs}
                                selectAll={selectAllSongs}
                                openAddToPlaylist={open}
                            />
                        }
                    />
                ) : (
                    <SheetHeader
                        title="History"
                        headerRight={<MenuButton openAddToPlaylist={open} />}
                    />
                )}
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
                                    multiselectedSongs.includes(song.id)
                                }
                                onPress={() => {
                                    onPress(song);
                                }}
                                onLongPress={() => {
                                    onLongPress(song.id);
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
                songs={
                    multiselectedSongs.length > 0
                        ? multiselectedSongs
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
                    touchableOpacityProps={{
                        onPress: () => setVisible(true),
                    }}
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
                    touchableOpacityProps={{
                        onPress: () => setVisible(true),
                    }}
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
