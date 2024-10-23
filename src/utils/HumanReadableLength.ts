import Pluralize from "./Pluralize";

export default function HumanReadableLength(length: number): {
    number: string;
    unit: string;
} {
    const hours = Math.floor(length / 3600000);
    const minutes = Math.floor((length % 3600000) / 60000);

    if (hours > 0) {
        return {
            number: `${hours}`,
            unit: Pluralize(hours, "hour", "hours", false),
        };
    } else {
        return {
            number: `${minutes}`,
            unit: Pluralize(minutes, "minute", "minutes", false),
        };
    }
}
