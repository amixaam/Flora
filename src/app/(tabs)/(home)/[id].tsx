import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import ContainerSheet from "../../../Components/BottomSheets/Container/ContainerSheet";
import SongSheet from "../../../Components/BottomSheets/Song/SongSheet";
import AnimatedHeader from "../../../Components/UI/Headers/AnimatedHeader";
import ListItemsNotFound from "../../../Components/UI/Text/ListItemsNotFound";
import AlbumArt from "../../../Components/UI/UI chunks/AlbumArt";
import ImageBlurBackground from "../../../Components/UI/UI chunks/ImageBlurBackground";
import SongItem from "../../../Components/UI/UI chunks/SongItem";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { useSongsStore } from "../../../store/songsStore";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, ContainerType, Playlist, Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import { CalculateTotalDuration } from "../../../utils/FormatMillis";

export default function ContainerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    if (typeof id === "undefined") return router.back();

    const { setSelectedContainer, getSongsFromContainer, getContainer } =
        useSongsStore();

    let data = getContainer(id);

    const {
        sheetRef: SongOptionsRef,
        open: openSongOptions,
        close: dismissSongOptions,
    } = useBottomSheetModal();

    const {
        sheetRef: ContainerOptionsRef,
        open: openContainerOptions,
        close: dismissContainerOptions,
    } = useBottomSheetModal(async () => {
        if (data === undefined) return;
        await setSelectedContainer(data);
    });

    const insets = useSafeAreaInsets();

    const scrollY = useSharedValue(0);
    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    if (data === undefined) {
        return router.back();
    }

    let songData = getSongsFromContainer(id);

    return (
        <View style={[mainStyles.container, { position: "relative" }]}>
            <AnimatedHeader
                title={data.title}
                scrollY={scrollY}
                headerRight={{
                    icon: "dots-vertical",
                    onPress: openContainerOptions,
                }}
            />
            <Animated.ScrollView onScroll={handleScroll} style={{ flex: 1 }}>
                <SafeAreaView edges={["top"]} style={{ height: 105 }} />
                <ImageBlurBackground
                    image={data.artwork}
                    style={{ height: 500, top: 0 }}
                    blur={15}
                    gradient={{ colors: ["#050506", "#05050640", "#050506"] }}
                />

                <View style={{ flex: 1, gap: Spacing.appPadding }}>
                    <AlbumInfo
                        data={data}
                        songData={songData}
                        openContainerOptions={openContainerOptions}
                    />
                    <SongList
                        songData={songData}
                        isAlbum={"artist" in data}
                        openSongOptions={openSongOptions}
                    />
                </View>

                <View
                    style={{
                        paddingBottom: insets.bottom + Spacing.miniPlayer,
                    }}
                />

                <SongSheet ref={SongOptionsRef} dismiss={dismissSongOptions} />
                <ContainerSheet
                    ref={ContainerOptionsRef}
                    dismiss={dismissContainerOptions}
                />
            </Animated.ScrollView>
        </View>
    );
}

type AlbumInfoProps = {
    data: Playlist | Album;
    songData: Song[];
    openContainerOptions: () => void;
};
const AlbumInfo = ({
    data,
    songData,
    openContainerOptions,
}: AlbumInfoProps) => {
    const { shuffleList, addListToQueue } = useSongsStore();

    const isAlbum = data.type === ContainerType.ALBUM;

    return (
        <View
            style={{
                alignItems: "center",
                gap: Spacing.md,
                paddingHorizontal: Spacing.appPadding,
            }}
        >
            <AlbumArt image={data.artwork} style={{ width: 260 }} />
            <View style={{ gap: Spacing.xs }}>
                <Text style={[textStyles.h5, { textAlign: "center" }]}>
                    {data.title}
                </Text>
                <Text
                    style={[textStyles.small, { textAlign: "center" }]}
                    numberOfLines={2}
                >
                    {isAlbum
                        ? CombineStrings([data.artist, data.year])
                        : data?.description}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: -Spacing.md,
                }}
            >
                <IconButton
                    testID="single-container-shuffle-button"
                    icon="shuffle"
                    size={IconSizes.md}
                    onPress={() => shuffleList(songData, true)}
                    iconColor={Colors.primary}
                />
                <IconButton
                    testID="single-container-play-button"
                    icon="play-circle"
                    size={IconSizes.md * 2}
                    onPress={() => addListToQueue(songData, undefined, true)}
                    iconColor={Colors.primary}
                />
                <IconButton
                    testID="single-container-options-button"
                    icon="tune"
                    size={IconSizes.md}
                    onPress={openContainerOptions}
                    iconColor={Colors.primary}
                />
            </View>
        </View>
    );
};

type SongListProps = {
    songData: Song[];
    openSongOptions?: () => void;
    isAlbum?: boolean;
};
const SongList = ({
    songData,
    openSongOptions = () => {},
    isAlbum,
}: SongListProps) => {
    const { setSelectedSong, addListToQueue } = useSongsStore();

    return (
        <View style={{ minHeight: 5 }}>
            <FlashList
                data={songData}
                estimatedItemSize={100}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`No songs found, add some!`}
                        icon="music-note"
                    />
                }
                ListFooterComponent={
                    songData.length ? (
                        <View style={{ padding: Spacing.md }}>
                            <Text
                                style={[
                                    textStyles.small,
                                    { textAlign: "center" },
                                ]}
                            >
                                {CombineStrings([
                                    `${songData.length} songs`,
                                    CalculateTotalDuration(songData),
                                ])}
                            </Text>
                        </View>
                    ) : null
                }
                renderItem={({ item, index }) => (
                    <SongItem
                        song={item}
                        rightSideProps={{
                            count: isAlbum ? index + 1 : undefined,
                        }}
                        onPress={() => {
                            setSelectedSong(item);
                            addListToQueue(songData, item, true);
                        }}
                        controls={{
                            onPress: async () => {
                                await setSelectedSong(item);
                                openSongOptions();
                            },
                        }}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};
