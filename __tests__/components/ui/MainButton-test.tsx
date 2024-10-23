import { render, fireEvent } from "@testing-library/react-native";
import MainButton from "../../../src/Components/UI/Buttons/MainButton";

describe("MainButton", () => {
    it("renders correctly", () => {
        const { toJSON } = render(<MainButton />);

        expect(toJSON()).toMatchSnapshot();
    });

    it("matches text with prop text", () => {
        const text = "Custom button";
        const { getByText } = render(<MainButton text={text} />);

        expect(getByText(text)).toBeTruthy();
    });

    it("matches text with no prop text", () => {
        const { getByText } = render(<MainButton />);

        expect(getByText("Label")).toBeTruthy();
    });

    it("fires onPress", () => {
        const handlePress = jest.fn();
        const { getByText } = render(<MainButton onPress={handlePress} />);

        fireEvent.press(getByText("Label"));

        expect(handlePress).toHaveBeenCalledTimes(1);
    });
});
