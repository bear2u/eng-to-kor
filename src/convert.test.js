import test from 'node:test';
import assert from 'node:assert/strict';
import { toEnglishKeys } from './convert.js';

test('converts Korean and preserves mixed English and numbers', () => {
  assert.equal(toEnglishKeys('한글q12'), 'gksrmfq12');
  assert.equal(toEnglishKeys('안녕하세요'), 'dkssudgktpdy');
  assert.equal(toEnglishKeys('한글 ABC xyz 123!\n🙂\t日本語'), 'gksrmf ABC xyz 123!\n🙂\t日本語');
  assert.equal(toEnglishKeys(''), '');
});

test('handles standalone jamo, compound vowels, final clusters and shifted keys', () => {
  assert.equal(toEnglishKeys('ㅋㅋㅋ ㅘ ㄳ'), 'zzz hk rt');
  assert.equal(toEnglishKeys('값 읽 꽤 쐐 똠'), 'rkqt dlfr Rho Tho Eha');
  assert.equal(toEnglishKeys('ㄲㄸㅃㅆㅉㅒㅖ'), 'REQTWO P'.replace(' ', ''));
});

test('all 11,172 modern syllables match decomposed Hangul conversion', () => {
  for (let code = 0xac00; code <= 0xd7a3; code++) {
    const syllable = String.fromCodePoint(code);
    const converted = toEnglishKeys(syllable);
    assert.match(converted, /^[a-zA-Z]+$/);
    assert.equal(converted, toEnglishKeys(syllable.normalize('NFD')), syllable);
  }
});
