export function byteString(n, size = 8) {
    if (n < 0 || n > 255 || n % 1 !== 0) {
      return "0".repeat(size);
    }
    return ("0".repeat(size) + n.toString(2)).slice(-size)
  }
