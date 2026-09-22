const initial = ['r', 'R', 's', 'e', 'E', 'f', 'a', 'q', 'Q', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g'];
const medial = ['k', 'o', 'i', 'O', 'j', 'p', 'u', 'P', 'h', 'hk', 'ho', 'hl', 'y', 'n', 'nj', 'np', 'nl', 'b', 'm', 'ml', 'l'];
const final = ['', 'r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'qt', 't', 'T', 'd', 'w', 'c', 'z', 'x', 'v', 'g'];
const consonants = ['r', 'R', 'rt', 's', 'sw', 'sg', 'e', 'E', 'f', 'fr', 'fa', 'fq', 'ft', 'fx', 'fv', 'fg', 'a', 'q', 'Q', 'qt', 't', 'T', 'd', 'w', 'W', 'c', 'z', 'x', 'v', 'g'];

/** Convert modern Hangul to standard Korean two-set keyboard keystrokes. */
export function toEnglishKeys(text) {
  return Array.from(text, (char) => {
    const code = char.codePointAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      return initial[Math.floor(offset / 588)] + medial[Math.floor((offset % 588) / 28)] + final[offset % 28];
    }
    if (code >= 0x3131 && code <= 0x314e) return consonants[code - 0x3131];
    if (code >= 0x314f && code <= 0x3163) return medial[code - 0x314f];
    if (code >= 0x1100 && code <= 0x1112) return initial[code - 0x1100];
    if (code >= 0x1161 && code <= 0x1175) return medial[code - 0x1161];
    if (code >= 0x11a8 && code <= 0x11c2) return final[code - 0x11a7];
    return char;
  }).join('');
}
