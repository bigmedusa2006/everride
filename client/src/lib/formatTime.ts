export function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00:00";
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(':');
}
