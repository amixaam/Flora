import Slider from "@react-native-community/slider";

const PlaybackSlider = ({
    trackDuration,
    trackPosition,
    skipPosition,
}: {
    trackDuration: number;
    trackPosition: number;
    skipPosition: (value: number) => void;
}) => {
    return (
        <Slider
            value={
                trackPosition && trackDuration
                    ? trackPosition / trackDuration
                    : 0
            }
            onSlidingComplete={(value) => {
                const valueInMillis = value * trackDuration;
                skipPosition(valueInMillis);
            }}
            thumbTintColor="#E8DEF8"
            minimumTrackTintColor="#E8DEF8"
            maximumTrackTintColor="#E8DEF8"
            style={{
                marginHorizontal: -16,
            }}
        />
    );
};

export default PlaybackSlider;
