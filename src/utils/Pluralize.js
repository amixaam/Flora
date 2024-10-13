export default function Pluralize(
    count,
    noun,
    plural = `${noun}s`,
    showCount = true
) {
    const text = showCount ? count + " " : "";
    if (count === 1) {
        return text + noun;
    } else {
        return text + plural;
    }
}
