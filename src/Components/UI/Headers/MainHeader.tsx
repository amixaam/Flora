import { View } from "react-native";
import { textStyles } from "../../../styles/text";
import SheetHeader from "./SheetHeader";
import { Spacing } from "../../../styles/constants";
import IconButton from "../Buttons/IconButton";
import { router } from "expo-router";
import BackgroundImageAbsolute from "../UI chunks/BackgroundImageAbsolute";

interface MainHeaderProps {
    title?: string;
    headerRight?: React.ReactNode;
}

export const MainHeader = ({
    title = "Flora",
    headerRight,
}: MainHeaderProps) => {
    return (
        <>
            <SheetHeader
                title={title}
                titleStyle={textStyles.h4}
                headerLeft={<></>}
                headerRight={<IconHeaders headerRight={headerRight} />}
            />
        </>
    );
};

const IconHeaders = ({ headerRight }: { headerRight?: React.ReactNode }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing.md,
            }}
        >
            {headerRight}
            <IconButton
                icon="history"
                touchableOpacityProps={{
                    onPress: () => router.push("/history"),
                }}
            />
            <IconButton
                icon="magnify"
                touchableOpacityProps={{
                    onPress: () => router.push("/search"),
                }}
            />
        </View>
    );
};
