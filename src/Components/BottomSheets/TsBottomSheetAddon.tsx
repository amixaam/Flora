import React, { forwardRef } from "react";
import { Text } from "react-native";
import { textStyles } from "../../styles/text";
import { SheetModalLayout } from "./SheetModalLayout";
import { BottomSheetProps } from "../../types/other";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const TsBottomSheetAddon = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        return (
            <SheetModalLayout ref={ref} title={"custom title"}>
                <Text style={textStyles.h4}>Close Sheet</Text>
            </SheetModalLayout>
        );
    }
);

export default TsBottomSheetAddon;
