import { Hiragana } from '../../../entities/hiragana.entity';
import { Katakana } from '../../../entities/katakana.entity';

export interface KanaVariant {
  character: string;
  romaji: string;
}

export class KanaUtils {
  static formatKana<T extends Hiragana | Katakana>(kanaList: T[]): T[] {
    const formattedKana: T[] = [];

    for (const kana of kanaList) {
      formattedKana.push(kana);
      const romaji = kana.romaji;

      if (romaji === 'yu' || romaji === 'ya') {
        formattedKana.push({} as T);
      } else if (romaji === 'wa') {
        for (let i = 0; i < 3; i++) {
          formattedKana.push({} as T);
        }
      }
    }
    return formattedKana;
  }

  static getHiraganaVariants(): Record<string, KanaVariant[]> {
    const dakutenList: KanaVariant[] = [
      { character: 'が', romaji: 'ga' },
      { character: 'ぎ', romaji: 'gi' },
      { character: 'ぐ', romaji: 'gu' },
      { character: 'げ', romaji: 'ge' },
      { character: 'ご', romaji: 'go' },
      { character: 'ざ', romaji: 'za' },
      { character: 'じ', romaji: 'ji' },
      { character: 'ず', romaji: 'zu' },
      { character: 'ぜ', romaji: 'ze' },
      { character: 'ぞ', romaji: 'zo' },
      { character: 'だ', romaji: 'da' },
      { character: 'ぢ', romaji: 'ji' },
      { character: 'づ', romaji: 'zu' },
      { character: 'で', romaji: 'de' },
      { character: 'ど', romaji: 'do' },
      { character: 'ば', romaji: 'ba' },
      { character: 'び', romaji: 'bi' },
      { character: 'ぶ', romaji: 'bu' },
      { character: 'べ', romaji: 'be' },
      { character: 'ぼ', romaji: 'bo' },
      { character: 'ぱ', romaji: 'pa' },
      { character: 'ぴ', romaji: 'pi' },
      { character: 'ぷ', romaji: 'pu' },
      { character: 'ぺ', romaji: 'pe' },
      { character: 'ぽ', romaji: 'po' },
    ];

    const yoonList: KanaVariant[] = [
      { character: 'きゃ', romaji: 'kya' },
      { character: 'きゅ', romaji: 'kyu' },
      { character: 'きょ', romaji: 'kyo' },
      { character: 'しゃ', romaji: 'sha' },
      { character: 'しゅ', romaji: 'shu' },
      { character: 'しょ', romaji: 'sho' },
      { character: 'ちゃ', romaji: 'cha' },
      { character: 'ちゅ', romaji: 'chu' },
      { character: 'ちょ', romaji: 'cho' },
      { character: 'にゃ', romaji: 'nya' },
      { character: 'にゅ', romaji: 'nyu' },
      { character: 'にょ', romaji: 'nyo' },
      { character: 'ひゃ', romaji: 'hya' },
      { character: 'ひゅ', romaji: 'hyu' },
      { character: 'ひょ', romaji: 'hyo' },
      { character: 'みゃ', romaji: 'mya' },
      { character: 'みゅ', romaji: 'myu' },
      { character: 'みょ', romaji: 'myo' },
      { character: 'りゃ', romaji: 'rya' },
      { character: 'りゅ', romaji: 'ryu' },
      { character: 'りょ', romaji: 'ryo' },
      { character: 'ぎゃ', romaji: 'gya' },
      { character: 'ぎゅ', romaji: 'gyu' },
      { character: 'ぎょ', romaji: 'gyo' },
      { character: 'じゃ', romaji: 'ja' },
      { character: 'じゅ', romaji: 'ju' },
      { character: 'じょ', romaji: 'jo' },
      { character: 'びゃ', romaji: 'bya' },
      { character: 'びゅ', romaji: 'byu' },
      { character: 'びょ', romaji: 'byo' },
      { character: 'ぴゃ', romaji: 'pya' },
      { character: 'ぴゅ', romaji: 'pyu' },
      { character: 'ぴょ', romaji: 'pyo' },
    ];

    return {
      dakuten: dakutenList,
      yoon: yoonList,
    };
  }

  static getKatakanaVariants(): Record<string, KanaVariant[]> {
    const dakutenList: KanaVariant[] = [
      { character: 'ガ', romaji: 'ga' },
      { character: 'ギ', romaji: 'gi' },
      { character: 'グ', romaji: 'gu' },
      { character: 'ゲ', romaji: 'ge' },
      { character: 'ゴ', romaji: 'go' },
      { character: 'ザ', romaji: 'za' },
      { character: 'ジ', romaji: 'ji' },
      { character: 'ズ', romaji: 'zu' },
      { character: 'ゼ', romaji: 'ze' },
      { character: 'ゾ', romaji: 'zo' },
      { character: 'ダ', romaji: 'da' },
      { character: 'ヂ', romaji: 'ji' },
      { character: 'ヅ', romaji: 'zu' },
      { character: 'デ', romaji: 'de' },
      { character: 'ド', romaji: 'do' },
      { character: 'バ', romaji: 'ba' },
      { character: 'ビ', romaji: 'bi' },
      { character: 'ブ', romaji: 'bu' },
      { character: 'ベ', romaji: 'be' },
      { character: 'ボ', romaji: 'bo' },
      { character: 'パ', romaji: 'pa' },
      { character: 'ピ', romaji: 'pi' },
      { character: 'プ', romaji: 'pu' },
      { character: 'ペ', romaji: 'pe' },
      { character: 'ポ', romaji: 'po' },
    ];

    const yoonList: KanaVariant[] = [
      { character: 'キャ', romaji: 'kya' },
      { character: 'キュ', romaji: 'kyu' },
      { character: 'キョ', romaji: 'kyo' },
      { character: 'シャ', romaji: 'sha' },
      { character: 'シュ', romaji: 'shu' },
      { character: 'ショ', romaji: 'sho' },
      { character: 'チャ', romaji: 'cha' },
      { character: 'チュ', romaji: 'chu' },
      { character: 'チョ', romaji: 'cho' },
      { character: 'ニャ', romaji: 'nya' },
      { character: 'ニュ', romaji: 'nyu' },
      { character: 'ニョ', romaji: 'nyo' },
      { character: 'ヒャ', romaji: 'hya' },
      { character: 'ヒュ', romaji: 'hyu' },
      { character: 'ヒョ', romaji: 'hyo' },
      { character: 'ミャ', romaji: 'mya' },
      { character: 'ミュ', romaji: 'myu' },
      { character: 'ミョ', romaji: 'myo' },
      { character: 'リャ', romaji: 'rya' },
      { character: 'リュ', romaji: 'ryu' },
      { character: 'リョ', romaji: 'ryo' },
      { character: 'ギャ', romaji: 'gya' },
      { character: 'ギュ', romaji: 'gyu' },
      { character: 'ギョ', romaji: 'gyo' },
      { character: 'ジャ', romaji: 'ja' },
      { character: 'ジュ', romaji: 'ju' },
      { character: 'ジョ', romaji: 'jo' },
      { character: 'ビャ', romaji: 'bya' },
      { character: 'ビュ', romaji: 'byu' },
      { character: 'ビョ', romaji: 'byo' },
      { character: 'ピャ', romaji: 'pya' },
      { character: 'ピュ', romaji: 'pyu' },
      { character: 'ピョ', romaji: 'pyo' },
    ];

    return {
      dakuten: dakutenList,
      yoon: yoonList,
    };
  }
}
