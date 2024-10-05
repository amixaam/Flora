import { router } from "expo-router";
import {
    ImageBackground,
    Text,
    TouchableNativeFeedback,
    View,
} from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { useSongsStore } from "../../../store/songs";

import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ContainerSheet from "../../../Components/BottomSheets/Container/ContainerSheet";
import { IconSizes, Spacing } from "../../../styles/constants";
import { mainStyles, newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, Playlist } from "../../../types/song";

import IconButton from "../../../Components/UI/Buttons/IconButton";
import { MainHeader } from "../../../Components/UI/Headers/MainHeader";
import ContainerItem from "../../../Components/UI/UI chunks/ContainerItem";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import BackgroundImageAbsolute from "../../../Components/UI/UI chunks/BackgroundImageAbsolute";

export default function PlaylistsTab() {
    const { albums, getRecentlyPlayed } = useSongsStore();
    const insets = useSafeAreaInsets();

    const {
        sheetRef: containerRef,
        open: openContainer,
        close: closeContainer,
    } = useBottomSheetModal();

    return (
        <View style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <ScrollView style={mainStyles.transparentContainer}>
                <MainHeader />
                {/* <View
                style={{
                    flexDirection: "row",
                    gap: Spacing.md,
                    paddingBottom: Spacing.md,
                    marginHorizontal: Spacing.appPadding,
                    }}
                    >
                    <TouchableOpacity
                    onPress={() => {
                        router.push("/queue");
                        }}
                        >
                        <Text style={textStyles.text}>Queue</Text>
                        </TouchableOpacity>
                        </View> */}
                <View style={{ flex: 1, gap: Spacing.md }}>
                    {/* <RecapBanner /> */}
                    <HomeHeader text="Recently played" />
                    <HorizontalList
                        list={getRecentlyPlayed()}
                        longPress={openContainer}
                    />
                    {/* sorted by date modified */}
                    <HomeHeader text="Albums" />
                    <HorizontalList list={albums} longPress={openContainer} />

                    <HomeHeader text="Most played" />
                    <HorizontalList list={albums} longPress={openContainer} />

                    <HomeHeader text="Forgotten favourites" />
                    <HorizontalList list={albums} longPress={openContainer} />
                </View>
                <View
                    style={{
                        paddingBottom: insets.bottom + Spacing.miniPlayer,
                    }}
                />
                <ContainerSheet ref={containerRef} dismiss={closeContainer} />
            </ScrollView>
        </View>
    );
}

const RecapBanner = () => {
    return (
        <TouchableHighlight>
            <ImageBackground
                source={RecapGradient}
                style={newStyles.recapBanner}
                imageStyle={{ borderRadius: Spacing.radiusLg }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1,
                        gap: Spacing.lg,
                        paddingRight: Spacing.sm,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text style={textStyles.h5}>Your recap is here!</Text>
                        <Text style={textStyles.small}>
                            Find out what you’ve been listening to for the last
                            month!
                        </Text>
                    </View>
                    <IconButton icon="play" size={IconSizes.lg} />
                </View>
            </ImageBackground>
        </TouchableHighlight>
    );
};

type HorizontalListProps = {
    list?: (Playlist | Album)[];
    longPress?: () => void;
};
const HorizontalList = ({
    list = [],
    longPress = () => {},
}: HorizontalListProps) => {
    const { setSelectedContainer } = useSongsStore();

    return (
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
                <View style={{ width: Spacing.appPadding }} />
            )}
            renderItem={({ item }) => (
                <ContainerItem
                    viewProps={{
                        style: {
                            width: 160,
                        },
                    }}
                    item={item}
                    touchableProps={{
                        onPress: () => {
                            router.push(`./${item.id}`);
                        },
                        onLongPress: async () => {
                            await setSelectedContainer(item);
                            longPress();
                        },
                    }}
                />
            )}
        />
    );
};

const HomeHeader = ({ text = "Header" }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: Spacing.appPadding,
                marginTop: Spacing.md,
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
                <IconButton icon="play" />
                <IconButton icon="shuffle" />
            </View>
        </View>
    );
};

type CategoriesSelectorProps = {
    touchableNativeProps?: React.ComponentProps<typeof TouchableNativeFeedback>;
    buttons: string[];
};
const CategoriesSelector = ({
    buttons = ["Chip 1", "Chip 2"],
    touchableNativeProps = {},
}: CategoriesSelectorProps) => {
    const [activeButton, setActiveButton] = useState(0);

    return (
        <View
            style={{
                flexDirection: "row",
                gap: Spacing.sm,
                paddingHorizontal: Spacing.appPadding,
            }}
        >
            {buttons.map((button, index) => (
                <Chip
                    key={button + index}
                    text={button}
                    touchableNativeProps={{
                        ...touchableNativeProps,
                        onPress: () => setActiveButton(index),
                    }}
                    selected={activeButton === index}
                />
            ))}
        </View>
    );
};

type ButtonProps = {
    touchableNativeProps?: React.ComponentProps<typeof TouchableNativeFeedback>;
    text: string;
    selected: boolean;
};

const Chip = ({
    text = "Chip",
    touchableNativeProps = {},
    selected = false,
}: ButtonProps) => {
    return (
        <TouchableNativeFeedback {...touchableNativeProps}>
            <View style={[newStyles.chip, selected && newStyles.chipSelected]}>
                <Text style={textStyles.text}>{text}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};
