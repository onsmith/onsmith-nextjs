import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { inflateSync } from "node:zlib";

// The optional argument points the check at a directory other than out/, such as a fixture.
const root = process.argv[2] ?? "out";
const index = join(root, "index.html");
if (!existsSync(index)) {
  console.error(`${index} is missing; run npm run build first`);
  process.exit(1);
}

const failures: string[] = [];

function fail(file: string, message: string) {
  failures.push(`${relative(root, file)}: ${message}`);
}

const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const phonePattern = /(?<![\w./])(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}(?!\w|\.\d)/g;

// Offsets only, so a failing job never prints the address or number into a public log.
function scanText(file: string, text: string) {
  for (const match of text.matchAll(emailPattern)) {
    fail(file, `email address at offset ${match.index}`);
  }
  for (const match of text.matchAll(phonePattern)) {
    fail(file, `phone number at offset ${match.index}`);
  }
}

// PDF strings and XMP packets hold link targets and metadata; bare numbers in xref tables and font widths are skipped.
function pdfTexts(file: string, bytes: Buffer): string[] {
  const raw = bytes.toString("latin1");
  const bodies: string[] = [];
  const outside = raw.replace(/stream\r?\n([\s\S]*?)endstream/g, (match, body: string, offset: number) => {
    const dictionary = raw.slice(raw.lastIndexOf("obj", offset), offset);
    if (!dictionary.includes("/FlateDecode")) {
      bodies.push(body);
      return "";
    }
    const start = offset + match.length - "endstream".length - body.length;
    try {
      bodies.push(inflateSync(bytes.subarray(start, start + body.length)).toString("latin1"));
    } catch {
      fail(file, "PDF stream could not be decompressed");
    }
    return "";
  });
  return [outside, ...bodies].flatMap((text) => [
    ...pdfStrings(text),
    ...(text.match(/<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/g) ?? []),
  ]);
}

const escapes: Record<string, string> = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "\r": "", "\n": "" };

function pdfStrings(text: string): string[] {
  const strings: string[] = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "(") {
      let depth = 1;
      let value = "";
      i++;
      while (i < text.length) {
        const c = text[i++];
        if (c === "\\" && i < text.length) {
          const octal = /^[0-7]{1,3}/.exec(text.slice(i, i + 3));
          if (octal) {
            value += String.fromCharCode(parseInt(octal[0], 8) & 0xff);
            i += octal[0].length;
          } else {
            value += escapes[text[i]] ?? text[i];
            i++;
          }
        } else if (c === "(") {
          depth++;
          value += c;
        } else if (c === ")" && --depth === 0) {
          break;
        } else {
          value += c;
        }
      }
      strings.push(decodePdfString(Buffer.from(value, "latin1")));
    } else if (text[i] === "<" && text[i + 1] !== "<" && text[i - 1] !== "<") {
      const end = text.indexOf(">", i);
      if (end === -1) {
        break;
      }
      const hex = text.slice(i + 1, end).replace(/\s/g, "");
      if (/^[0-9a-f]*$/i.test(hex)) {
        strings.push(decodePdfString(Buffer.from(hex.length % 2 ? `${hex}0` : hex, "hex")));
        i = end;
      }
      i++;
    } else {
      i++;
    }
  }
  return strings;
}

function decodePdfString(bytes: Buffer): string {
  if (bytes[0] !== 0xfe || bytes[1] !== 0xff) {
    return bytes.toString("latin1");
  }
  const units = Buffer.from(bytes.subarray(2, bytes.length - ((bytes.length - 2) % 2)));
  return units.swap16().toString("utf16le");
}

const xmpLocation =
  /GPS(Latitude|Longitude|Altitude|DestLatitude|DestLongitude|AreaInformation)|Iptc4xmpCore:Location|Iptc4xmpExt:Location(Created|Shown)|photoshop:(City|State|Country)/;

// EXIF GPS IFD tags that locate the camera or subject: https://exiftool.org/TagNames/GPS.html
const gpsLocationTags = new Set([1, 2, 3, 4, 5, 6, 19, 20, 21, 22, 28]);

function exifHasLocation(tiff: Buffer): boolean {
  const little = tiff.toString("latin1", 0, 2) === "II";
  const u16 = (offset: number) => (little ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset));
  const u32 = (offset: number) => (little ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset));
  const ifd = u32(4);
  for (let entry = ifd + 2; entry < ifd + 2 + u16(ifd) * 12; entry += 12) {
    if (u16(entry) !== 0x8825) {
      continue;
    }
    const gps = u32(entry + 8);
    for (let tag = gps + 2; tag < gps + 2 + u16(gps) * 12; tag += 12) {
      if (gpsLocationTags.has(u16(tag))) {
        return true;
      }
    }
  }
  return false;
}

// Walks the segments before start-of-scan and throws on anything that is not a marker, so a parse failure fails the check.
function jpegHasLocation(bytes: Buffer): boolean {
  let offset = 2;
  while (bytes[offset + 1] !== 0xda) {
    if (offset + 4 > bytes.length || bytes[offset] !== 0xff) {
      throw new Error("malformed JPEG");
    }
    if (bytes[offset + 1] === 0xff) {
      offset++;
      continue;
    }
    const length = bytes.readUInt16BE(offset + 2);
    const payload = bytes.subarray(offset + 4, offset + 2 + length);
    if (bytes[offset + 1] === 0xe1) {
      if (payload.toString("latin1", 0, 6) === "Exif\0\0" && exifHasLocation(payload.subarray(6))) {
        return true;
      }
      if (xmpLocation.test(payload.toString("latin1"))) {
        return true;
      }
    }
    offset += 2 + length;
  }
  return false;
}

function pngHasLocation(bytes: Buffer): boolean {
  let offset = 8;
  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("latin1", offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === "eXIf" && exifHasLocation(data)) {
      return true;
    }
    if (type === "tEXt" || type === "zTXt" || type === "iTXt") {
      if (xmpLocation.test(pngText(type, data))) {
        return true;
      }
    }
    offset += 12 + length;
  }
  return false;
}

function pngText(type: string, data: Buffer): string {
  const keywordEnd = data.indexOf(0);
  if (type === "tEXt") {
    return data.toString("latin1", keywordEnd + 1);
  }
  if (type === "zTXt") {
    return inflateSync(data.subarray(keywordEnd + 2)).toString("latin1");
  }
  const compressed = data[keywordEnd + 1] === 1;
  const languageEnd = data.indexOf(0, keywordEnd + 3);
  const textStart = data.indexOf(0, languageEnd + 1) + 1;
  const text = data.subarray(textStart);
  return (compressed ? inflateSync(text) : text).toString("utf8");
}

const textExtensions = new Set([".html", ".js", ".css", ".json"]);
const imageExtensions = new Set([
  ".apng", ".avif", ".bmp", ".gif", ".heic", ".heif", ".ico", ".jxl", ".svg", ".tif", ".tiff", ".webp",
]);

const files = readdirSync(root, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name));

for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (textExtensions.has(extension)) {
    scanText(file, readFileSync(file, "utf8"));
  } else if (extension === ".pdf") {
    for (const text of pdfTexts(file, readFileSync(file))) {
      scanText(file, text);
    }
  } else if (extension === ".jpg" || extension === ".jpeg" || extension === ".png") {
    try {
      const bytes = readFileSync(file);
      if (extension === ".png" ? pngHasLocation(bytes) : jpegHasLocation(bytes)) {
        fail(file, "image carries location metadata");
      }
    } catch {
      fail(file, "image metadata could not be read");
    }
  } else if (imageExtensions.has(extension)) {
    fail(file, `unchecked image format ${extension}`);
  }
}

const html = readFileSync(index, "utf8");
const headEnd = html.indexOf("</head>");
const head = headEnd === -1 ? "" : html.slice(0, headEnd);
const themeScript = Array.from(head.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)).find(
  ([, attributes = "", body]) => !attributes.includes("src=") && body.includes("data-theme-toggle"),
);
const stylesheet = head.search(/<link\b[^>]*\brel="stylesheet"/);
if (!themeScript) {
  fail(index, "theme script is missing from <head>");
} else {
  if (stylesheet !== -1 && stylesheet < (themeScript.index ?? 0)) {
    fail(index, "theme script comes after the first stylesheet");
  }
  try {
    new Function(themeScript[2]);
  } catch {
    fail(index, "theme script does not parse");
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} files in ${root}/`);
}
