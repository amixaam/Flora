import Slider from "@react-native-community/slider";
const PlaybackSlider = ({ trackDuration, trackPosition, skipPosition }) => {
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
                marginHorizontal: -15,
            }}
        />
    );
};

export default PlaybackSlider;
