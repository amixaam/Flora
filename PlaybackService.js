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

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
        TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener(Event.RemoteSetRating, (event) => {
        // console.log("Event.RemoteLike", event);
    });

    TrackPlayer.addEventListener(Event.RemoteDislike, (event) => {
        // console.log("Event.RemoteDislike", event);
    });

    TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
        // console.log("Event.RemoteJumpForward", event);
        await TrackPlayer.seekBy(event.interval);
    });

    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
        // console.log("Event.RemoteJumpBackward", event);
        await TrackPlayer.seekBy(-event.interval);
    });

    TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
        // console.log("Event.RemoteSeek", event);
        TrackPlayer.seekTo(event.position);
    });

    TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
        // console.log("Event.RemoteDuck", event);
    });

    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
        console.log("Event.PlaybackQueueEnded", event);
    });

    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
        if (event.track) {
            // console.log(event);
            useSongsStore.getState().updateSongStatistics(event.track.id);
            useSongsStore.getState().addSongToHistory(event.track.id);
            // console.log("youve GiYAAAT to be kidding me!!!");
        }
        // if (event.lastTrack) {
        //     console.log("Skipped track: ", event.lastTrack);
        //     useSongsStore.getState().updateSongSkip(event.track.id);
        // }
    });

    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
        // console.log("Event.PlaybackProgressUpdated", event);
    });

    TrackPlayer.addEventListener(
        Event.PlaybackPlayWhenReadyChanged,
        (event) => {
            // console.log("Event.PlaybackPlayWhenReadyChanged", event);
        }
    );

    TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
        // console.log("Event.PlaybackState", event);
    });

    TrackPlayer.addEventListener(Event.MetadataChapterReceived, (event) => {
        // console.log("Event.MetadataChapterReceived", event);
    });

    TrackPlayer.addEventListener(Event.MetadataTimedReceived, (event) => {
        // console.log("Event.MetadataTimedReceived", event);
    });

    TrackPlayer.addEventListener(Event.MetadataCommonReceived, (event) => {
        // console.log("Event.MetadataCommonReceived", event);
    });

    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, (event) => {
        // console.log("Event.PlaybackProgressUpdated", event);
    });
};
