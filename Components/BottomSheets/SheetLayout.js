import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Text } from "react-native";
import { mainStyles, textStyles } from "../styles";

const SheetLayout = forwardRef(({ props, title, children }, ref) => {
    // sheet defaults
    const snapPoints = useMemo(() => ["25%", "55%"], []);
    const renderBackdrop = useCallback((props) => (
        <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
        />
    ));

    return (
        <BottomSheetModal
            ref={ref}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={mainStyles.color_primary}
            backgroundStyle={mainStyles.color_secondary}
        >
            <BottomSheetView style={{ marginHorizontal: 16 }}>
                <Text style={[[textStyles.h5], { marginBottom: 8 }]}>
                    {title ? title : "Bottom sheet"}
                </Text>
                <BottomSheetView style={{ height: "100%" }}>
                    {children}
                </BottomSheetView>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default SheetLayout;
