const FormatMillis = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

const FormatSecs = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};

const CalculateDurationLeft = (position, duration) => {
    const durationLeft = duration - position;
    const minutes = Math.floor(durationLeft / 60);
    const seconds = Math.floor(durationLeft % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

const CalculateTotalDuration = (songs) => {
    let totalDuration = 0;
    songs.forEach((song) => {
        totalDuration += parseInt(song.duration);
    });
    return FormatMillis(totalDuration);
};

export {
    FormatMillis,
    FormatSecs,
    CalculateTotalDuration,
    CalculateDurationLeft,
};
