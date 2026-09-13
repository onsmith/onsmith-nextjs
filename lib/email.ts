/** Encodes an address for the browser. The result contains no "@" unless the address contains "?". */
export function encodeEmail(address: string): string {
  return shift(reverse(address), 1);
}

/** Returns the address that encodeEmail encoded. */
export function decodeEmail(encoded: string): string {
  return reverse(shift(encoded, -1));
}

function reverse(text: string): string {
  return text.split("").reverse().join("");
}

function shift(text: string, offset: number): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) + offset);
  }
  return result;
}
