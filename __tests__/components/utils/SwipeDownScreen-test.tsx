import { render } from "@testing-library/react-native";
import React from "react";
import SwipeDownScreen from "../../../src/Components/UI/Utils/SwipeDownScreen";

describe("SwipeDownScreen", () => {
    beforeEach(() => {
        // @ts-ignore
    });

    it("renders correctly with minimal props", () => {
        const { toJSON } = render(<SwipeDownScreen />);
        expect(toJSON()).toMatchSnapshot();
    });
});
