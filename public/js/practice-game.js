const romajiToKana = {
    'a':  ['あ', 'ア'],   'i': ['い', 'イ'],   'u': ['う', 'ウ'],   'e': ['え', 'エ'],   'o': ['お', 'オ'],
    'ka': ['か', 'カ'],  'ki': ['き', 'キ'],  'ku': ['く', 'ク'],  'ke': ['け', 'ケ'],  'ko': ['こ', 'コ'],
    'ga': ['が', 'ガ'],  'gi': ['ぎ', 'ギ'],  'gu': ['ぐ', 'グ'],  'ge': ['げ', 'ゲ'],  'go': ['ご', 'ゴ'],
    'sa': ['さ', 'サ'], 'shi': ['し', 'シ'],  'su': ['す', 'ス'],  'se': ['せ', 'セ'],  'so': ['そ', 'ソ'],
    'za': ['ざ', 'ザ'],  'ji': ['じ', 'ジ'],  'zu': ['ず', 'ズ'],  'ze': ['ぜ', 'ゼ'],  'zo': ['ぞ', 'ゾ'],
    'ta': ['た', 'タ'], 'chi': ['ち', 'チ'], 'tsu': ['つ', 'ツ'],  'te': ['て', 'テ'],  'to': ['と', 'ト'],
    'da': ['だ', 'ダ'],  'ji': ['ぢ', 'ヂ'],  'zu': ['づ', 'ヅ'],  'de': ['で', 'デ'],  'do': ['ど', 'ド'],
    'na': ['な', 'ナ'],  'ni': ['に', 'ニ'],  'nu': ['ぬ', 'ヌ'],  'ne': ['ね', 'ネ'],  'no': ['の', 'ノ'],
    'ha': ['は', 'ハ'],  'hi': ['ひ', 'ヒ'],  'fu': ['ふ', 'フ'],  'he': ['へ', 'ヘ'],  'ho': ['ほ', 'ホ'],
    'ba': ['ば', 'バ'],  'bi': ['び', 'ビ'],  'bu': ['ぶ', 'ブ'],  'be': ['べ', 'ベ'],  'bo': ['ぼ', 'ボ'],
    'pa': ['ぱ', 'パ'],  'pi': ['ぴ', 'ピ'],  'pu': ['ぷ', 'プ'],  'pe': ['ぺ', 'ペ'],  'po': ['ぽ', 'ポ'],
    'ma': ['ま', 'マ'],  'mi': ['み', 'ミ'],  'mu': ['む', 'ム'],  'me': ['め', 'メ'],  'mo': ['も', 'モ'],
    'ya': ['や', 'ヤ'],                      'yu': ['ゆ', 'ユ'],                       'yo': ['よ', 'ヨ'],
    'ra': ['ら', 'ラ'],  'ri': ['り', 'リ'],  'ru': ['る', 'ル'],  're': ['れ', 'レ'],  'ro': ['ろ', 'ロ'],
    'wa': ['わ', 'ワ'],                                                               'wo': ['を', 'ヲ'],
    'n':  ['ん', 'ン'],

    'kya': ['きゃ', 'キャ'],                  'kyu': ['きゅ', 'キュ'],                  'kyo': ['きょ', 'キョ'],
    'gya': ['ぎゃ', 'ギャ'],                  'gyu': ['ぎゅ', 'ギュ'],                  'gyo': ['ぎょ', 'ギョ'],
    'sha': ['しゃ', 'シャ'],                  'shu': ['しゅ', 'シュ'],                  'sho': ['しょ', 'ショ'],
    'cha': ['ちゃ', 'チャ'],                  'chu': ['ちゅ', 'チュ'],                  'cho': ['ちょ', 'チョ'],
    'nya': ['にゃ', 'ニャ'],                  'nyu': ['にゅ', 'ニュ'],                  'nyo': ['にょ', 'ニョ'],
    'hya': ['ひゃ', 'ヒャ'],                  'hyu': ['ひゅ', 'ヒュ'],                  'hyo': ['ひょ', 'ヒョ'],
    'bya': ['びゃ', 'ビャ'],                  'byu': ['びゅ', 'ビュ'],                  'byo': ['びょ', 'ビョ'],
    'pya': ['ぴゃ', 'ピャ'],                  'pyu': ['ぴゅ', 'ピュ'],                  'pyo': ['ぴょ', 'ピョ'],
    'mya': ['みゃ', 'ミャ'],                  'myu': ['みゅ', 'ミュ'],                  'myo': ['みょ', 'ミョ'],
    'rya': ['りゃ', 'リャ'],                  'ryu': ['りゅ', 'リュ'],                  'ryo': ['りょ', 'リョ'],
};

const kanaDisplay = document.querySelector('.kana-character');
const kanaForm = document.querySelector('.kana-form');
const answerInput = document.getElementById('answer-input');
const checkButton = document.querySelector('.check-button');
const gameContainer = document.querySelector('.kana-game-container');
const correctScore = document.getElementById('correct-score');
const incorrectScore = document.getElementById('incorrect-score');

const pageTitle = document.title.toLowerCase();
const kanaIndex = pageTitle.includes('hiragana') ? 0 : 1;

function getRandomRomajiAndKana() {
    const keys = Object.keys(romajiToKana);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const kanaPair = romajiToKana[randomKey];
    return { romaji: randomKey, kana: kanaPair[kanaIndex] };
}

let currentKana = getRandomRomajiAndKana();
kanaDisplay.textContent = currentKana.kana;

kanaForm.addEventListener('submit', (event) => {
    event.preventDefault();

    answerInput.disabled = true;
    kanaForm.querySelector('button').disabled = true;

    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentKana.romaji;
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
        correctScore.textContent = parseInt(correctScore.textContent) + 1;
        gameContainer.style.backgroundColor = 'lightgreen';
        checkButton.style.backgroundColor = 'lightgreen';
    } else {
        incorrectScore.textContent = parseInt(incorrectScore.textContent) + 1;
        gameContainer.style.backgroundColor = 'indianred';
        checkButton.style.backgroundColor = 'indianred';
    }

    setTimeout(() => {
        gameContainer.style.backgroundColor = '';
        checkButton.style.backgroundColor = '#007BFF';
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();
        kanaForm.querySelector('button').disabled = false;

        currentKana = getRandomRomajiAndKana();
        kanaDisplay.textContent = currentKana.kana;
    }, 2000);
});