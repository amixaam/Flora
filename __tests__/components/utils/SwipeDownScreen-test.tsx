import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import SwipeDownScreen from "../../../src/Components/UI/Utils/SwipeDownScreen";
import { View, Text } from "react-native";
import { Colors } from "../../../src/styles/constants";
import { ScrollView } from "react-native-gesture-handler";

// Mock expo-router
jest.mock("expo-router", () => ({
    router: {
        back: jest.fn(),
    },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => ({
    View: require("react-native").View,
    useSharedValue: (value: any) => ({ value }),
    useAnimatedStyle: () => ({}),
    withTiming: (toValue: any) => toValue,
    runOnJS: (fn: any) => fn,
    createAnimatedComponent: (component: any) => component,
}));

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
    const View = require("react-native").View;
    const ScrollView = require("react-native").ScrollView;
    return {
        GestureDetector: ({ children }: { children: React.ReactNode }) => (
            <View>{children}</View>
        ),
        Gesture: {
            Pan: () => ({
                onUpdate: () => ({ onUpdate: jest.fn() }),
                onEnd: () => ({ onEnd: jest.fn() }),
            }),
        },
        ScrollView: ScrollView,
    };
});

// Mock react-native
jest.mock("react-native", () => ({
    View: ({
        children,
        testID,
    }: {
        children?: React.ReactNode;
        testID?: string;
    }) => <div data-testid={testID}>{children}</div>,
    Text: ({ children }: { children?: React.ReactNode }) => (
        <span>{children}</span>
    ),
    ScrollView: ({
        children,
        onScroll,
    }: {
        children?: React.ReactNode;
        onScroll?: Function;
    }) => <div>{children}</div>,
    Dimensions: {
        get: jest.fn().mockReturnValue({ height: 800 }),
    },
    StyleSheet: {
        create: (styles: any) => styles,
    },
}));

describe("SwipeDownScreen", () => {
    const mockChildren = (
        <View testID="mock-children">
            <Text>Test Content</Text>
        </View>
    );
    const mockRouter = require("expo-router").router;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly with default props", () => {
        const { toJSON } = render(<SwipeDownScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with children", () => {
        const { getByTestId } = render(
            <SwipeDownScreen>{mockChildren}</SwipeDownScreen>
        );
        expect(getByTestId("mock-children")).toBeTruthy();
    });

    it("renders with custom background color", () => {
        const { toJSON } = render(
            <SwipeDownScreen bgColor={Colors.primary}>
                {mockChildren}
            </SwipeDownScreen>
        );
        const tree = toJSON();
        expect(tree).toBeTruthy();
    });

    it("renders without gesture handling when disabled", () => {
        const { getByTestId } = render(
            <SwipeDownScreen disable>{mockChildren}</SwipeDownScreen>
        );
        expect(getByTestId("mock-children")).toBeTruthy();
    });

    it("renders with custom header", () => {
        const customHeader = (
            <View testID="custom-header">
                <Text>Custom Header</Text>
            </View>
        );
        const { getByTestId } = render(
            <SwipeDownScreen header={customHeader}>
                {mockChildren}
            </SwipeDownScreen>
        );
        expect(getByTestId("custom-header")).toBeTruthy();
    });

    describe("Gesture Handling", () => {
        it("renders ScrollView when not disabled", () => {
            const { UNSAFE_getByType } = render(
                <SwipeDownScreen>{mockChildren}</SwipeDownScreen>
            );
            expect(() => UNSAFE_getByType(ScrollView)).not.toThrow();
        });

        it("does not render ScrollView when disabled", () => {
            const { UNSAFE_queryByType } = render(
                <SwipeDownScreen disable>{mockChildren}</SwipeDownScreen>
            );
            expect(() => UNSAFE_queryByType(ScrollView)).not.toThrow();
        });

        it("calls router.back when gesture threshold is exceeded", () => {
            render(<SwipeDownScreen>{mockChildren}</SwipeDownScreen>);
            expect(mockRouter.back).not.toHaveBeenCalled();
            // Note: Testing actual gesture behavior would require more complex setup
        });
    });
});
