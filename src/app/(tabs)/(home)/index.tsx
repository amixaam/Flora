import { router } from "expo-router";
import { ImageBackground, Text, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../../store/songsStore";

import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContainerSheet from "../../../Components/BottomSheets/Container/ContainerSheet";
import { Colors, ImageSources, Spacing } from "../../../styles/constants";
import { mainStyles, newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist, Song } from "../../../types/song";

import { TouchableRipple } from "react-native-paper";
import SongSheet from "../../../Components/BottomSheets/Song/SongSheet";
import IconButton from "../../../Components/UI/Buttons/IconButton";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";
import ContainerItem from "../../../Components/UI/UI chunks/ContainerItem";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";

export default function HomeTab() {
    const {
        getRecentlyPlayed,
        getRecentlyAddedSongs,
        setSelectedContainer,
        setSelectedSong,
    } = useSongsStore();
    const insets = useSafeAreaInsets();

    const {
        sheetRef: containerRef,
        open: openContainer,
        close: closeContainer,
    } = useBottomSheetModal();

    const {
        sheetRef: songRef,
        open: openSong,
        close: closeSong,
    } = useBottomSheetModal();

    const onContainerLongPress = async (container: Album | Playlist) => {
        await setSelectedContainer(container);
        openContainer();
    };
    const onSongLongPress = async (song: Song) => {
        await setSelectedSong(song);
        openSong();
    };

    const recentlyAddedSongs = getRecentlyAddedSongs();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />

            <ScrollView
                style={[mainStyles.transparentContainer]}
                contentContainerStyle={{
                    paddingBottom: Spacing.miniPlayer * 2,
                }}
            >
                <MainHeader />
                <RecapBanner />
                <View style={{ marginTop: Spacing.md }}>
                    <HorizontalList
                        text="Recently added songs"
                        list={recentlyAddedSongs}
                        longPress={onSongLongPress}
                    />
                    <HorizontalList
                        text="Recently played"
                        list={getRecentlyPlayed()}
                        longPress={onContainerLongPress}
                    />
                </View>
            </ScrollView>
            <ContainerSheet ref={containerRef} dismiss={closeContainer} />
            <SongSheet ref={songRef} dismiss={closeSong} />
        </View>
    );
}

const RecapBanner = () => {
    const onPress = () => {
        router.push("overlays/recap");
    };

    const radius = Spacing.radiusLg;

    return (
        <ImageBackground
            source={ImageSources.banner}
            style={newStyles.recapBanner}
        >
            <TouchableRipple
                onPress={onPress}
                style={[mainStyles.fullSize, { justifyContent: "flex-end" }]}
            >
                <View
                    style={{
                        padding: Spacing.appPadding,
                        backgroundColor: Colors.bg + "50",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={textStyles.h5}>Your Recap is here!</Text>
                    <IconButton
                        icon="arrow-right"
                        iconColor={Colors.primary}
                        onPress={onPress}
                    />
                </View>
            </TouchableRipple>
        </ImageBackground>
    );
};

type HorizontalListProps = {
    list?: (Playlist | Album | Song)[];
    longPress?: any;
    onPress?: any;
    text?: string;
};
const HorizontalList = ({
    list = [],
    longPress,
    onPress,
    text = "List header",
}: HorizontalListProps) => {
    const { shuffleList, getSongsFromContainer, addListToQueue } =
        useSongsStore();

    // shuffle list items
    const onHeaderPress = async () => {
        if (list.every((item) => "sampleRate" in item)) {
            shuffleList(list);
            return;
        }

        // convert list of containers to list of songs
        const songs = list
            .map((container) => getSongsFromContainer(container.id))
            .flat()
            .filter((s) => s !== undefined) as Song[];

        shuffleList(songs, true);
    };

    const onContainerPress = (item: Playlist | Album | Song) => {
        if (onPress) {
            onPress(item);
            return;
        }

        if (list.every((item) => "sampleRate" in item)) {
            addListToQueue(list, item as Song, true);
            return;
        }

        router.push(`/${item.id}`);
    };

    return (
        <View
            style={{
                gap: Spacing.md,
                marginTop: Spacing.md,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: Spacing.appPadding,
                }}
            >
                <Text
                    style={[
                        textStyles.h5,
                        {
                            flex: 1,
                            marginRight: Spacing.md,
                        },
                    ]}
                    numberOfLines={1}
                >
                    {text}
                </Text>
                <View style={{ flexDirection: "row", gap: Spacing.md }}>
                    <IconButton
                        icon="shuffle"
                        testID="shuffle-button"
                        onPress={onHeaderPress}
                    />
                </View>
            </View>
            <FlashList
                horizontal
                data={list}
                extraData={list}
                keyExtractor={(item) => item.id}
                estimatedItemSize={10}
                contentContainerStyle={{
                    paddingHorizontal: Spacing.appPadding,
                }}
                ItemSeparatorComponent={() => (
                    <View style={{ width: Spacing.md }} />
                )}
                renderItem={({ item }) => (
                    <ContainerItem
                        style={{
                            width: 160,
                        }}
                        selectPadding={false}
                        item={item}
                        icon={{
                            onPress: () => {
                                longPress(item);
                            },
                        }}
                        onLongPress={() => {
                            longPress(item);
                        }}
                        onPress={() => {
                            onContainerPress(item);
                        }}
                    />
                )}
            />
        </View>
    );
};
