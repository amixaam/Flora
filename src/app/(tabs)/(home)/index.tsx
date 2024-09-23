import { router } from "expo-router";
import {
    ImageBackground,
    Text,
    TouchableNativeFeedback,
    View,
} from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useCallback, useRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import ContainerSheet from "../../../Components/BottomSheets/Container/ContainerSheet";
import IconButton from "../../../Components/UI/IconButton";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { mainStyles, newStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album, History, Playlist } from "../../../types/song";

// @ts-ignore
import RecapGradient from "../../../../assets/images/recap-gradient.png";
import ContainerItem from "../../../Components/UI/ContainerItem";

export default function PlaylistsTab() {
    const { playlists, albums, getRecentlyPlayed, getHistory, clearHistory } =
        useSongsStore();
    const insets = useSafeAreaInsets();

    const [first, setfirst] = useState<boolean>(false);
    const [history, setHistory] = useState<History>({
        history: [],
        consciousHistory: [],
    });

    const updateHistory = () => {
        setHistory(getHistory());
    };

    const ContainerOptionsRef = useRef<BottomSheetModal>(null);
    const openContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.present();
    }, []);

    const dismissContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.dismiss();
    }, []);

    return (
        <ScrollView style={mainStyles.container}>
            <BackgroundImageAbsolute />
            <View style={{ paddingTop: insets.top * 2.3 }} />

            <View
                style={{
                    flexDirection: "row",
                    gap: Spacing.sm,
                    flex: 1,
                    marginHorizontal: Spacing.appPadding,
                }}
            >
                <TouchableNativeFeedback
                    onPress={() => {
                        setfirst(!first);
                        updateHistory();
                    }}
                >
                    <View
                        style={[
                            mainStyles.button_skeleton,
                            {
                                backgroundColor: Colors.primary,
                                marginBottom: Spacing.md,
                            },
                        ]}
                    >
                        <Text
                            style={[textStyles.text, { color: Colors.input }]}
                        >
                            {first ? "Close history" : "Open history"}{" "}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => clearHistory()}>
                    <View
                        style={[
                            mainStyles.button_skeleton,
                            {
                                backgroundColor: Colors.primary,
                                marginBottom: Spacing.md,
                            },
                        ]}
                    >
                        <Text
                            style={[textStyles.text, { color: Colors.input }]}
                        >
                            Clear history
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>

            <Text
                style={[
                    textStyles.text,
                    {
                        marginBottom: Spacing.md,
                        display: first ? "flex" : "none",
                    },
                ]}
            >
                {JSON.stringify(history, null, 6)}
            </Text>

            <View style={{ flex: 1, gap: Spacing.md }}>
                {/* <RecapBanner /> */}
                <HomeHeader text="Recently played" />
                {/* Pin Liked songs playlist to first position */}
                {/* Limit to 10 entries */}
                <HorizontalList
                    list={getRecentlyPlayed()}
                    longPress={openContainerOptions}
                />
                <View style={{ gap: Spacing.xs }}>
                    <HomeHeader text="Mood board" />
                    <CategoriesSelector
                        buttons={["Sleep", "Focus", "Energize", "sad"]}
                    />
                </View>
                <HorizontalList
                    list={albums}
                    longPress={openContainerOptions}
                />
                {/* <HomeHeader text="Most played" />
                <HomeHeader text="Recaps" /> */}
            </View>
            <View
                style={{ paddingBottom: insets.bottom + Spacing.miniPlayer }}
            />
            <ContainerSheet
                ref={ContainerOptionsRef}
                dismiss={dismissContainerOptions}
            />
        </ScrollView>
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
                        onLongPress: () => {
                            setSelectedContainer(item);
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
            <View style={{ flexDirection: "row", gap: Spacing.xs }}>
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
