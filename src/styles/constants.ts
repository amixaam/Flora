export enum Spacing {
    xs = 4,
    sm = 8,
    mmd = 12,
    md = 16, //default
    lg = 24,
    xl = 32,
    appPadding = 16,
    radiusSm = 5,
    radius = 10,
    radiusMd = 15,
    radiusLg = 25,
    round = 9999,
    miniPlayer = 60,
    bottomTab = 80, // + bottom safe area inset (which is dependant on device)
}

export enum IconSizes {
    sm = 20,
    md = 26, //default
    lg = 30,
    xl = 36,
    xxl = 64,
}
export const DefaultIcon = "help-circle";

export enum FontSize {
    h3 = 36,
    h4 = 30,
    h5 = 22,
    h6 = 17,
    text = 12,
    small = 10,
    detail = 8,
}

export enum ImageSources {
    cover = require("../../assets/images/empty-cover.png"),
    likedSongsCover = require("../../assets/images/liked-songs-cover.png"),
    AppBackground = require("../../assets/images/indexBlur.png"),
}

export enum Colors {
    transparent = "transparent",
    primary = "#E8DEF8",
    primary90 = "#E8DEF890",
    primary30 = "#E8DEF830",
    secondary = "#16151B",
    bg = "#050506",
    bg70 = "#05050670",
    input = "#2B2931",
    input60 = "#2B293160",
    neon10 = "#9747FF10",

    badgeRare = "#5E4C96",
    badgeLegendary = "#E8D07C",
}

export enum SnapPoints {
    full = "93%",
    xl = "80%",
    lg = "65%",
    md = "50%", // default
    sm = "35%",
}
