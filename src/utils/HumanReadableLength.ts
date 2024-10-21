export default function HumanReadableLength(length: number): {
    number: string;
    unit: string;
} {
    const hours = Math.floor(length / 3600000);
    const minutes = Math.floor((length % 3600000) / 60000);

    if (hours > 0) {
        return { number: `${hours}`, unit: "hours" };
    } else {
        return { number: `${minutes}`, unit: "minutes" };
    }
}
