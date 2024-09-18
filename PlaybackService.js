import TrackPlayer, { Event } from "react-native-track-player";
import { useSongsStore } from "./src/store/songs";

export const PlaybackService = async function () {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
        TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
        TrackPlayer.stop();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        const track = await TrackPlayer.getActiveTrack();
        await TrackPlayer.skipToNext();

        useSongsStore.getState().updateSongSkip(track.id);
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        const playbackProgress = await TrackPlayer.getProgress();

        if (playbackProgress.position >= 3) {
            await TrackPlayer.seekTo(0);
        } else {
            await TrackPlayer.skipToPrevious();
        }
    });

    // TrackPlayer.addEventListener(Event.RemoteSetRating, (event) => {
    //     console.log("Event.RemoteLike", event);
    // });

    // TrackPlayer.addEventListener(Event.RemoteDislike, (event) => {
    //     console.log("Event.RemoteDislike", event);
    // });

    TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
        await TrackPlayer.seekBy(event.interval);
    });

    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
        await TrackPlayer.seekBy(-event.interval);
    });

    TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
        TrackPlayer.seekTo(event.position);
    });

    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
        if (event.track) {
            useSongsStore.getState().updateSongStatistics(event.track.id);
            useSongsStore.getState().addSongToHistory(event.track.id);
        }
    });

    TrackPlayer.addEventListener(
        Event.PlaybackPlayWhenReadyChanged,
        (event) => {
            // console.log("Event.PlaybackPlayWhenReadyChanged", event);
        }
    );

    // TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    //     console.log("Event.PlaybackState", event);
    // });
};
