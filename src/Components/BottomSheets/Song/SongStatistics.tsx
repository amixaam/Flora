import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import moment from "moment";
import { forwardRef, StrictMode } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSongsStore } from "../../../store/songsStore";
import {
    Colors,
    IconSizes,
    SnapPoints,
    Spacing,
} from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { BottomSheetProps } from "../../../types/other";
import { abbreviateNumber, ordinateNumber } from "../../../utils/FormatNumber";
import LargeTextButton from "../../UI/Buttons/LargeTextButton";
import ListItemsNotFound from "../../UI/Text/ListItemsNotFound";
import SmallStatisticText from "../../UI/Text/SmallStatisticText";
import { UISeperator } from "../../UI/Utils/UISeperator";
import { SheetModalLayout } from "../SheetModalLayout";

const SongStatistics = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedSong, getSongRanking } = useSongsStore();
        if (selectedSong === undefined) return;

        const statistics = selectedSong.statistics;

        const lastPlayed = moment(statistics.lastPlayed, true).fromNow();
        const creationDate = moment(
            statistics.creationDate,
            "DD-MM-YYYY",
            true
        ).format("MMMM Do, YYYY");

        var timeListened =
            (selectedSong.statistics.playCount * selectedSong.duration) / 1000;

        var formattedTimeListened;

        // show minutes instead of hours
        if (timeListened <= 3600) {
            formattedTimeListened = Math.round(timeListened / 60);
        } else {
            // show hours
            formattedTimeListened =
                Math.round((timeListened / 60 / 60) * 10) / 10;
        }

        const rank = getSongRanking(selectedSong.id);

        // [bgColor, textColor]
        const getBadgeColors = (rank: number) => {
            switch (rank) {
                case 1:
                    return [Colors.badgeLegendary, Colors.secondary];
                case 2:
                    return [Colors.primary, Colors.secondary];
                case 3:
                    return [Colors.badgeRare, Colors.primary];
                default:
                    return [undefined, undefined];
            }
        };

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={`Song statistics`}
                    snapPoints={[SnapPoints.lg]}
                >
                    <BottomSheetView
                        style={{
                            marginHorizontal: Spacing.appPadding,
                            gap: Spacing.md,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                gap: Spacing.sm,
                            }}
                        >
                            <LargeTextButton
                                mainText={formattedTimeListened.toString()}
                                subText={
                                    (timeListened <= 3600
                                        ? "Minutes"
                                        : "Hours") + " listened"
                                }
                            />
                            <LargeTextButton
                                mainText={ordinateNumber(rank)}
                                subText="Album rank"
                                bgColor={getBadgeColors(rank)[0]}
                                textColor={getBadgeColors(rank)[1]}
                            />
                            <LargeTextButton
                                mainText={abbreviateNumber(
                                    statistics.playCount
                                )}
                                subText="Plays"
                            />
                        </BottomSheetView>
                        <UISeperator />
                        <View style={{ marginVertical: -Spacing.sm }}>
                            <SmallStatisticText
                                icon="heart"
                                header="Last played"
                                text={"Since " + creationDate}
                            />
                            <SmallStatisticText
                                icon="skip-next"
                                header="Time listened"
                                text={`Skipped ${abbreviateNumber(
                                    statistics.skipCount
                                )} times`}
                            />
                            <SmallStatisticText
                                icon="history"
                                header="Time listened"
                                text={"Last played " + lastPlayed}
                            />
                        </View>
                        <UISeperator />
                        <Text style={textStyles.h5}>Badges</Text>
                        <FlatList
                            data={[]}
                            numColumns={2}
                            ListEmptyComponent={
                                <ListItemsNotFound
                                    text="No badges yet!"
                                    icon="trophy-variant"
                                />
                            }
                            contentContainerStyle={{ gap: Spacing.md }}
                            columnWrapperStyle={{ gap: Spacing.md }}
                            renderItem={() => <Badge />}
                            // @ts-ignore
                            keyExtractor={(item) => item.toString()}
                        />
                    </BottomSheetView>
                </SheetModalLayout>
            </>
        );
    }
);

interface BadgeProps {
    text?: string;
    iconColor?: Colors;
    icon?: string;
    bgColor?: Colors;
}

const Badge = ({
    text = "Badge text",
    iconColor = Colors.primary,
    icon = "music-note",
    bgColor = Colors.input,
}: BadgeProps) => {
    return (
        <BottomSheetView
            style={{ flex: 1, gap: Spacing.sm, alignItems: "center" }}
        >
            <BottomSheetView
                style={{
                    width: "100%",
                    alignItems: "center",
                    borderRadius: Spacing.radius,
                    paddingBottom: Spacing.md,
                    paddingTop: Spacing.md,

                    backgroundColor: bgColor,
                }}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={IconSizes.md}
                    style={{ color: iconColor }}
                />
            </BottomSheetView>
            <Text style={textStyles.text}>{text}</Text>
        </BottomSheetView>
    );
};

export default SongStatistics;
