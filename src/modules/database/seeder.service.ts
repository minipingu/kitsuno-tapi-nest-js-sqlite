import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  Hiragana,
  Katakana,
  Kanji,
  Particle,
  User,
  Flashcard,
} from '../../entities';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Hiragana)
    private readonly hiraganaRepo: Repository<Hiragana>,
    @InjectRepository(Katakana)
    private readonly katakanaRepo: Repository<Katakana>,
    @InjectRepository(Kanji)
    private readonly kanjiRepo: Repository<Kanji>,
    @InjectRepository(Particle)
    private readonly particleRepo: Repository<Particle>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Flashcard)
    private readonly flashcardRepo: Repository<Flashcard>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking database seed state...');
    await this.seedHiragana();
    await this.seedKatakana();
    await this.seedKanji();
    await this.seedParticles();
    await this.seedDemoUserAndFlashcards();
    this.logger.log('Database seed check complete.');
  }

  private async seedHiragana() {
    const count = await this.hiraganaRepo.count();
    if (count > 0) return;

    this.logger.log('Seeding Hiragana characters...');
    const hiraganaData: Partial<Hiragana>[] = [
      // Vowels
      { character: 'あ', romaji: 'a', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/a.mp3', mnemonic: 'An apple with a stem', story: 'Imagine an apple (あ) with a leafy stem on top.', strokeOrder: 'stroke-a.svg' },
      { character: 'い', romaji: 'i', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/i.mp3', mnemonic: 'Two eels side by side', story: 'Looks like two eels swimming next to each other.', strokeOrder: 'stroke-i.svg' },
      { character: 'う', romaji: 'u', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/u.mp3', mnemonic: 'A heavy weight on someone’s back', story: 'Looks like a man hunched over carrying heavy luggage saying "Oof!".', strokeOrder: 'stroke-u.svg' },
      { character: 'え', romaji: 'e', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/e.mp3', mnemonic: 'An energetic exotic bird', story: 'Looks like an energetic bird with an exaggerated crest.', strokeOrder: 'stroke-e.svg' },
      { character: 'お', romaji: 'o', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/o.mp3', mnemonic: 'A golfer swinging onto the green', story: 'A golfer swinging a club hitting a golf ball onto the course.', strokeOrder: 'stroke-o.svg' },
      // K-row
      { character: 'か', romaji: 'ka', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ka.mp3', mnemonic: 'A camera on a tripod', story: 'Looks like someone snapping a photo with a camera.', strokeOrder: 'stroke-ka.svg' },
      { character: 'き', romaji: 'ki', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ki.mp3', mnemonic: 'A key', story: 'Looks just like an old skeleton key.', strokeOrder: 'stroke-ki.svg' },
      { character: 'く', romaji: 'ku', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ku.mp3', mnemonic: 'A cuckoo bird’s beak', story: 'A wide open bird beak crying cuckoo!', strokeOrder: 'stroke-ku.svg' },
      { character: 'け', romaji: 'ke', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ke.mp3', mnemonic: 'A keg of root beer', story: 'Looks like a tall wooden beer keg with spigots.', strokeOrder: 'stroke-ke.svg' },
      { character: 'こ', romaji: 'ko', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ko.mp3', mnemonic: 'A pair of koala ears', story: 'Two soft curved strokes like a pair of koala ears.', strokeOrder: 'stroke-ko.svg' },
      // S-row
      { character: 'さ', romaji: 'sa', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/sa.mp3', mnemonic: 'A smiling samurai', story: 'A happy face of a samurai practicing martial arts.', strokeOrder: 'stroke-sa.svg' },
      { character: 'し', romaji: 'shi', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/shi.mp3', mnemonic: 'A fishing hook', story: 'Looks like a slender fishing hook dipping into the sea.', strokeOrder: 'stroke-shi.svg' },
      { character: 'す', romaji: 'su', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/su.mp3', mnemonic: 'A swirling noodle', story: 'A noodle looped up on chopsticks ready to slurrrrp.', strokeOrder: 'stroke-su.svg' },
      { character: 'せ', romaji: 'se', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/se.mp3', mnemonic: 'A couple saying secrets', story: 'Two people leaning close whispering a secret.', strokeOrder: 'stroke-se.svg' },
      { character: 'そ', romaji: 'so', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/so.mp3', mnemonic: 'A sewing stitch pattern', story: 'A zig-zag stitch in sewing fabric.', strokeOrder: 'stroke-so.svg' },
      // T-row
      { character: 'た', romaji: 'ta', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ta.mp3', mnemonic: 'Spells out "ta"', story: 'The strokes resemble the letters "t" and "a".', strokeOrder: 'stroke-ta.svg' },
      { character: 'ち', romaji: 'chi', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/chi.mp3', mnemonic: 'A cheerleader waving pom-poms', story: 'A cute cheerleader jumping high in excitement.', strokeOrder: 'stroke-chi.svg' },
      { character: 'つ', romaji: 'tsu', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/tsu.mp3', mnemonic: 'A towering tsunami wave', story: 'A single massive tidal wave curling overhead.', strokeOrder: 'stroke-tsu.svg' },
      { character: 'て', romaji: 'te', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/te.mp3', mnemonic: 'A dog’s tail', story: 'Looks like a wagging tail of a golden retriever.', strokeOrder: 'stroke-te.svg' },
      { character: 'と', romaji: 'to', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/to.mp3', mnemonic: 'A thorn in a toe', story: 'Looks like a sharp splinter piercing a toe.', strokeOrder: 'stroke-to.svg' },
      // N-row
      { character: 'な', romaji: 'na', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/na.mp3', mnemonic: 'A nun praying before a cross', story: 'A nun bowing devoutly in prayer.', strokeOrder: 'stroke-na.svg' },
      { character: 'に', romaji: 'ni', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ni.mp3', mnemonic: 'A needle and thread', story: 'A sharp sewing needle on the left with thread lines on the right.', strokeOrder: 'stroke-ni.svg' },
      { character: 'ぬ', romaji: 'nu', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/nu.mp3', mnemonic: 'Chopsticks tangled in noodles', story: 'Chopsticks looping around tasty ramen noodles.', strokeOrder: 'stroke-nu.svg' },
      { character: 'ね', romaji: 'ne', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ne.mp3', mnemonic: 'A cat (neko) with curled tail', story: 'A charming kitten with a swirly curled tail.', strokeOrder: 'stroke-ne.svg' },
      { character: 'の', romaji: 'no', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/no.mp3', mnemonic: 'A big red NO sign', story: 'A circle with a stroke crossing through, meaning NO.', strokeOrder: 'stroke-no.svg' },
      // H-row
      { character: 'は', romaji: 'ha', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ha.mp3', mnemonic: 'An upper-case H and small a', story: 'The strokes form a stylized "Ha".', strokeOrder: 'stroke-ha.svg' },
      { character: 'ひ', romaji: 'hi', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/hi.mp3', mnemonic: 'A smiling mouth laughing "hee hee"', story: 'A cheeky grinning face with a wide chin.', strokeOrder: 'stroke-hi.svg' },
      { character: 'ふ', romaji: 'fu', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/fu.mp3', mnemonic: 'Mount Fuji', story: 'A serene mountain peak with misty clouds on both sides.', strokeOrder: 'stroke-fu.svg' },
      { character: 'へ', romaji: 'he', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/he.mp3', mnemonic: 'A steep hiking hill', story: 'A pointy steep hill to climb.', strokeOrder: 'stroke-he.svg' },
      { character: 'ほ', romaji: 'ho', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ho.mp3', mnemonic: 'A horse wearing a cap', story: 'A tall horse with its head covered in a sun hat.', strokeOrder: 'stroke-ho.svg' },
      // M-row
      { character: 'ま', romaji: 'ma', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ma.mp3', mnemonic: 'A theatrical mask', story: 'Two eyebrows and a chin of an ancient kabuki mask.', strokeOrder: 'stroke-ma.svg' },
      { character: 'み', romaji: 'mi', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/mi.mp3', mnemonic: 'Lucky number 21', story: 'Looks like numeral 2 followed by a stroke making 21.', strokeOrder: 'stroke-mi.svg' },
      { character: 'む', romaji: 'mu', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/mu.mp3', mnemonic: 'A moo cow face', story: 'A friendly cow with horns and a nose ring going MOOO.', strokeOrder: 'stroke-mu.svg' },
      { character: 'め', romaji: 'me', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/me.mp3', mnemonic: 'An eye (me) with eyelashes', story: 'A graceful eye surrounded by lashes.', strokeOrder: 'stroke-me.svg' },
      { character: 'も', romaji: 'mo', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/mo.mp3', mnemonic: 'A fish hook catching more worms', story: 'A double-barbed fish hook that snags even more fish.', strokeOrder: 'stroke-mo.svg' },
      // Y-row
      { character: 'や', romaji: 'ya', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ya.mp3', mnemonic: 'A yak head with horns', story: 'A sturdy Himalayan yak gazing into the distance.', strokeOrder: 'stroke-ya.svg' },
      { character: 'ゆ', romaji: 'yu', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/yu.mp3', mnemonic: 'A swimming fish', story: 'A slender fish darting through the waves.', strokeOrder: 'stroke-yu.svg' },
      { character: 'よ', romaji: 'yo', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/yo.mp3', mnemonic: 'A yo-yo hanging on a string', story: 'A yo-yo suspended in mid-air right after playing.', strokeOrder: 'stroke-yo.svg' },
      // R-row
      { character: 'ら', romaji: 'ra', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ra.mp3', mnemonic: 'A rapid runner', story: 'A runner crouching down and sprinting forward.', strokeOrder: 'stroke-ra.svg' },
      { character: 'り', romaji: 'ri', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ri.mp3', mnemonic: 'River reeds', story: 'Two reeds swaying in a gentle river stream.', strokeOrder: 'stroke-ri.svg' },
      { character: 'る', romaji: 'ru', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ru.mp3', mnemonic: 'A route with a loop', story: 'A winding country road with a cul-de-sac at the bottom.', strokeOrder: 'stroke-ru.svg' },
      { character: 'れ', romaji: 're', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/re.mp3', mnemonic: 'A resting traveler', story: 'A weary hiker resting under a trail sign.', strokeOrder: 'stroke-re.svg' },
      { character: 'ろ', romaji: 'ro', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/ro.mp3', mnemonic: 'A road without a loop', story: 'Just like "ru", but the loop was robbed by road bandits!', strokeOrder: 'stroke-ro.svg' },
      // W-row & N
      { character: 'わ', romaji: 'wa', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/wa.mp3', mnemonic: 'A magical wasp', story: 'A wasp buzzing through the garden air.', strokeOrder: 'stroke-wa.svg' },
      { character: 'を', romaji: 'wo', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/wo.mp3', mnemonic: 'An Olympic athlete with a disc', story: 'An athlete ready to launch a discus into the arena.', strokeOrder: 'stroke-wo.svg' },
      { character: 'ん', romaji: 'n', audio: 'https://assets.tofugu.com/audio/japanese/hiragana/n.mp3', mnemonic: 'Looks like lowercase n', story: 'A flowing cursive "n" written with a brush.', strokeOrder: 'stroke-n.svg' },
    ];

    await this.hiraganaRepo.save(hiraganaData);
    this.logger.log(`Seeded ${hiraganaData.length} Hiragana characters.`);
  }

  private async seedKatakana() {
    const count = await this.katakanaRepo.count();
    if (count > 0) return;

    this.logger.log('Seeding Katakana characters...');
    const katakanaData: Partial<Katakana>[] = [
      // Vowels
      { character: 'ア', romaji: 'a', audio: 'https://assets.tofugu.com/audio/japanese/katakana/a.mp3', mnemonic: 'An axe head', story: 'Looks like a sharp axe blade striking down.', strokeOrder: 'stroke-kata-a.svg' },
      { character: 'イ', romaji: 'i', audio: 'https://assets.tofugu.com/audio/japanese/katakana/i.mp3', mnemonic: 'An easel', story: 'Looks like a painter\'s tripod easel standing upright.', strokeOrder: 'stroke-kata-i.svg' },
      { character: 'ウ', romaji: 'u', audio: 'https://assets.tofugu.com/audio/japanese/katakana/u.mp3', mnemonic: 'An astronaut helmet', story: 'Looks like the top visor of a futuristic space helmet.', strokeOrder: 'stroke-kata-u.svg' },
      { character: 'エ', romaji: 'e', audio: 'https://assets.tofugu.com/audio/japanese/katakana/e.mp3', mnemonic: 'An elevator beam', story: 'An industrial steel I-beam used in elevators.', strokeOrder: 'stroke-kata-e.svg' },
      { character: 'オ', romaji: 'o', audio: 'https://assets.tofugu.com/audio/japanese/katakana/o.mp3', mnemonic: 'An opera singer striking a pose', story: 'An opera singer passionately belting out a solo.', strokeOrder: 'stroke-kata-o.svg' },
      // K-row
      { character: 'カ', romaji: 'ka', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ka.mp3', mnemonic: 'A card edge', story: 'The angular top corner of a card.', strokeOrder: 'stroke-kata-ka.svg' },
      { character: 'キ', romaji: 'ki', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ki.mp3', mnemonic: 'A key with two notches', story: 'A key with two horizontal ridges.', strokeOrder: 'stroke-kata-ki.svg' },
      { character: 'ク', romaji: 'ku', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ku.mp3', mnemonic: 'A cook\'s chef hat', story: 'A tipped chef hat worn while cooking delicious ramen.', strokeOrder: 'stroke-kata-ku.svg' },
      { character: 'ケ', romaji: 'ke', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ke.mp3', mnemonic: 'A kettle spout', story: 'The pouring handle and spout of a kettle.', strokeOrder: 'stroke-kata-ke.svg' },
      { character: 'コ', romaji: 'ko', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ko.mp3', mnemonic: 'A corner of a box', story: 'Two crisp edges forming a rectangular corner.', strokeOrder: 'stroke-kata-ko.svg' },
      // S-row
      { character: 'サ', romaji: 'sa', audio: 'https://assets.tofugu.com/audio/japanese/katakana/sa.mp3', mnemonic: 'Three sardines swimming', story: 'Three little fish swimming in formation.', strokeOrder: 'stroke-kata-sa.svg' },
      { character: 'シ', romaji: 'shi', audio: 'https://assets.tofugu.com/audio/japanese/katakana/shi.mp3', mnemonic: 'A smiling seal looking up', story: 'A smiling seal face looking upward from below.', strokeOrder: 'stroke-kata-shi.svg' },
      { character: 'ス', romaji: 'su', audio: 'https://assets.tofugu.com/audio/japanese/katakana/su.mp3', mnemonic: 'A superhero landing', story: 'A dynamic superhero posing after a steep drop.', strokeOrder: 'stroke-kata-su.svg' },
      { character: 'セ', romaji: 'se', audio: 'https://assets.tofugu.com/audio/japanese/katakana/se.mp3', mnemonic: 'A set of theater stairs', story: 'Angular steps leading up to an illuminated stage.', strokeOrder: 'stroke-kata-se.svg' },
      { character: 'ソ', romaji: 'so', audio: 'https://assets.tofugu.com/audio/japanese/katakana/so.mp3', mnemonic: 'A sewing needle plunging downward', story: 'A needle stroke pointing steeply down towards the fabric.', strokeOrder: 'stroke-kata-so.svg' },
      // T-row
      { character: 'タ', romaji: 'ta', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ta.mp3', mnemonic: 'A taco with toppings', story: 'A crispy taco shell with fillings inside.', strokeOrder: 'stroke-kata-ta.svg' },
      { character: 'チ', romaji: 'chi', audio: 'https://assets.tofugu.com/audio/japanese/katakana/chi.mp3', mnemonic: 'A cheerleader\'s megaphone', story: 'A megaphone used to cheer on the team.', strokeOrder: 'stroke-kata-chi.svg' },
      { character: 'ツ', romaji: 'tsu', audio: 'https://assets.tofugu.com/audio/japanese/katakana/tsu.mp3', mnemonic: 'Two raindrops dropping down', story: 'Two splashes falling downward into a pool.', strokeOrder: 'stroke-kata-tsu.svg' },
      { character: 'テ', romaji: 'te', audio: 'https://assets.tofugu.com/audio/japanese/katakana/te.mp3', mnemonic: 'A television antenna', story: 'An old-school TV aerial receiving broadcasts.', strokeOrder: 'stroke-kata-te.svg' },
      { character: 'ト', romaji: 'to', audio: 'https://assets.tofugu.com/audio/japanese/katakana/to.mp3', mnemonic: 'A totem pole branch', story: 'A straight post with a little wooden branch.', strokeOrder: 'stroke-kata-to.svg' },
      // N-row
      { character: 'ナ', romaji: 'na', audio: 'https://assets.tofugu.com/audio/japanese/katakana/na.mp3', mnemonic: 'A narwhal tusk', story: 'A cross sword showing a narwhal’s proud horn.', strokeOrder: 'stroke-kata-na.svg' },
      { character: 'ニ', romaji: 'ni', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ni.mp3', mnemonic: 'Two needles parallel', story: 'Two simple parallel bars, also the kanji for two (二).', strokeOrder: 'stroke-kata-ni.svg' },
      { character: 'ヌ', romaji: 'nu', audio: 'https://assets.tofugu.com/audio/japanese/katakana/nu.mp3', mnemonic: 'New noose or lasso', story: 'A cowboy’s looped lasso ready for cattle.', strokeOrder: 'stroke-kata-nu.svg' },
      { character: 'ネ', romaji: 'ne', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ne.mp3', mnemonic: 'A necklace on a jewelry bust', story: 'An elegant pendant resting on display.', strokeOrder: 'stroke-kata-ne.svg' },
      { character: 'ノ', romaji: 'no', audio: 'https://assets.tofugu.com/audio/japanese/katakana/no.mp3', mnemonic: 'A long nose slash', story: 'A clean swift downward stroke representing a sharp nose.', strokeOrder: 'stroke-kata-no.svg' },
      // H-row
      { character: 'ハ', romaji: 'ha', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ha.mp3', mnemonic: 'A hay stack parting', story: 'Two wisps of hay spreading apart.', strokeOrder: 'stroke-kata-ha.svg' },
      { character: 'ヒ', romaji: 'hi', audio: 'https://assets.tofugu.com/audio/japanese/katakana/hi.mp3', mnemonic: 'A hero standing proudly', story: 'A person standing at attention ready to save the day.', strokeOrder: 'stroke-kata-hi.svg' },
      { character: 'フ', romaji: 'fu', audio: 'https://assets.tofugu.com/audio/japanese/katakana/fu.mp3', mnemonic: 'A football goal corner', story: 'The top crossbar corner of a goal post.', strokeOrder: 'stroke-kata-fu.svg' },
      { character: 'ヘ', romaji: 'he', audio: 'https://assets.tofugu.com/audio/japanese/katakana/he.mp3', mnemonic: 'A helmet top', story: 'Identical to hiragana \'he\', an angular hill.', strokeOrder: 'stroke-kata-he.svg' },
      { character: 'ホ', romaji: 'ho', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ho.mp3', mnemonic: 'A holy wooden cross', story: 'A cross adorned with holiday ribbons.', strokeOrder: 'stroke-kata-ho.svg' },
      // M-row
      { character: 'マ', romaji: 'ma', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ma.mp3', mnemonic: 'A martini glass silhouette', story: 'An angled triangular cocktail glass.', strokeOrder: 'stroke-kata-ma.svg' },
      { character: 'ミ', romaji: 'mi', audio: 'https://assets.tofugu.com/audio/japanese/katakana/mi.mp3', mnemonic: 'Three missile streaks', story: 'Three sharp angled trails in the sky.', strokeOrder: 'stroke-kata-mi.svg' },
      { character: 'ム', romaji: 'mu', audio: 'https://assets.tofugu.com/audio/japanese/katakana/mu.mp3', mnemonic: 'A cow’s muzzle', story: 'A sturdy triangular muzzle of a cow.', strokeOrder: 'stroke-kata-mu.svg' },
      { character: 'メ', romaji: 'me', audio: 'https://assets.tofugu.com/audio/japanese/katakana/me.mp3', mnemonic: 'A metallic sword cross', story: 'Two crossed blades in combat.', strokeOrder: 'stroke-kata-me.svg' },
      { character: 'モ', romaji: 'mo', audio: 'https://assets.tofugu.com/audio/japanese/katakana/mo.mp3', mnemonic: 'A modern monitor stand', story: 'A multi-tier display stand.', strokeOrder: 'stroke-kata-mo.svg' },
      // Y-row
      { character: 'ヤ', romaji: 'ya', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ya.mp3', mnemonic: 'A yacht sail', story: 'A triangular sail catching sea wind.', strokeOrder: 'stroke-kata-ya.svg' },
      { character: 'ユ', romaji: 'yu', audio: 'https://assets.tofugu.com/audio/japanese/katakana/yu.mp3', mnemonic: 'Number 1 hook', story: 'An inverted hook shaped like the corner of number 1.', strokeOrder: 'stroke-kata-yu.svg' },
      { character: 'ヨ', romaji: 'yo', audio: 'https://assets.tofugu.com/audio/japanese/katakana/yo.mp3', mnemonic: 'A yoga mat rack', story: 'Three shelves holding rolled yoga mats.', strokeOrder: 'stroke-kata-yo.svg' },
      // R-row
      { character: 'ラ', romaji: 'ra', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ra.mp3', mnemonic: 'A radar dish', story: 'An angled dish picking up radio signals.', strokeOrder: 'stroke-kata-ra.svg' },
      { character: 'リ', romaji: 'ri', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ri.mp3', mnemonic: 'Ribbons fluttering', story: 'Two vertical ribbons waving in the breeze.', strokeOrder: 'stroke-kata-ri.svg' },
      { character: 'ル', romaji: 'ru', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ru.mp3', mnemonic: 'Ruler legs', story: 'Two legs standing tall like drafting compass needles.', strokeOrder: 'stroke-kata-ru.svg' },
      { character: 'レ', romaji: 're', audio: 'https://assets.tofugu.com/audio/japanese/katakana/re.mp3', mnemonic: 'A red checkmark', story: 'A single checkmark confirming the correct answer.', strokeOrder: 'stroke-kata-re.svg' },
      { character: 'ロ', romaji: 'ro', audio: 'https://assets.tofugu.com/audio/japanese/katakana/ro.mp3', mnemonic: 'A robot mouth', story: 'A square mechanical mouth on a robot face.', strokeOrder: 'stroke-kata-ro.svg' },
      // W-row & N
      { character: 'ワ', romaji: 'wa', audio: 'https://assets.tofugu.com/audio/japanese/katakana/wa.mp3', mnemonic: 'A wine glass rim', story: 'The upper rim and stem of a wine chalice.', strokeOrder: 'stroke-kata-wa.svg' },
      { character: 'ヲ', romaji: 'wo', audio: 'https://assets.tofugu.com/audio/japanese/katakana/wo.mp3', mnemonic: 'A warrior\'s shield', story: 'A reinforced shield carried by a samurai.', strokeOrder: 'stroke-kata-wo.svg' },
      { character: 'ン', romaji: 'n', audio: 'https://assets.tofugu.com/audio/japanese/katakana/n.mp3', mnemonic: 'A ninja leaping upward', story: 'An upward diagonal stroke like a leaping ninja star.', strokeOrder: 'stroke-kata-n.svg' },
    ];

    await this.katakanaRepo.save(katakanaData);
    this.logger.log(`Seeded ${katakanaData.length} Katakana characters.`);
  }

  private async seedKanji() {
    const count = await this.kanjiRepo.count();
    if (count > 0) return;

    this.logger.log('Seeding Kanji characters...');
    const makeSvg = (char: string) =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109" class="stroke-order-svg"><text x="25" y="80" font-size="75" font-family="'Noto Sans JP', sans-serif" fill="#2d3748">${char}</text></svg>`;

    const kanjiData: Partial<Kanji>[] = [
      // Grade 1
      {
        character: '日',
        strokeCount: 4,
        grade: 1,
        meanings: 'day, sun, Japan, counter for days',
        onyomiReadings: ['ニチ', 'ジツ'],
        kunyomiReadings: ['ひ', '-び', '-か'],
        strokeOrderSvg: makeSvg('日'),
        vocab: ['毎日 【まいにち】every day', '日光 【にっこう】sunlight', '日曜日 【にちようび】Sunday', '休日 【きゅうじつ】holiday'],
      },
      {
        character: '月',
        strokeCount: 4,
        grade: 1,
        meanings: 'month, moon',
        onyomiReadings: ['ゲツ', 'ガツ'],
        kunyomiReadings: ['つき'],
        strokeOrderSvg: makeSvg('月'),
        vocab: ['月曜 【げつよう】Monday', '今月 【こんげつ】this month', '満月 【まんげつ】full moon', '正月 【しょうがつ】New Year'],
      },
      {
        character: '火',
        strokeCount: 4,
        grade: 1,
        meanings: 'fire',
        onyomiReadings: ['カ'],
        kunyomiReadings: ['ひ', '-び', 'ほ-'],
        strokeOrderSvg: makeSvg('火'),
        vocab: ['火曜日 【かようび】Tuesday', '火事 【かじ】fire', '火山 【かざん】volcano'],
      },
      {
        character: '水',
        strokeCount: 4,
        grade: 1,
        meanings: 'water',
        onyomiReadings: ['スイ'],
        kunyomiReadings: ['みず'],
        strokeOrderSvg: makeSvg('水'),
        vocab: ['水曜日 【すいようび】Wednesday', '水泳 【すいえい】swimming', '水 【みず】water', '洪水 【こうずい】flood'],
      },
      {
        character: '木',
        strokeCount: 4,
        grade: 1,
        meanings: 'tree, wood',
        onyomiReadings: ['ボク', 'モク'],
        kunyomiReadings: ['き', 'こ-'],
        strokeOrderSvg: makeSvg('木'),
        vocab: ['木曜日 【もくようび】Thursday', '木 【き】tree', '大木 【たいぼく】large tree'],
      },
      {
        character: '金',
        strokeCount: 8,
        grade: 1,
        meanings: 'gold, money',
        onyomiReadings: ['キン', 'コン'],
        kunyomiReadings: ['かね', 'かな-'],
        strokeOrderSvg: makeSvg('金'),
        vocab: ['金曜日 【きんようび】Friday', 'お金 【おかね】money', '金 【きん】gold', '貯金 【ちょきん】savings'],
      },
      {
        character: '土',
        strokeCount: 3,
        grade: 1,
        meanings: 'earth, soil, ground',
        onyomiReadings: ['ド', 'ト'],
        kunyomiReadings: ['つち'],
        strokeOrderSvg: makeSvg('土'),
        vocab: ['土曜日 【どようび】Saturday', '土地 【とち】land', '土 【つち】earth, soil'],
      },
      {
        character: '年',
        strokeCount: 6,
        grade: 1,
        meanings: 'year, counter for years',
        onyomiReadings: ['ネン'],
        kunyomiReadings: ['とし'],
        strokeOrderSvg: makeSvg('年'),
        vocab: ['今年 【ことし】this year', '来年 【らいねん】next year', '去年 【きょねん】last year', '新年 【しんねん】New Year'],
      },
      {
        character: '人',
        strokeCount: 2,
        grade: 1,
        meanings: 'person',
        onyomiReadings: ['ジン', 'ニン'],
        kunyomiReadings: ['ひと'],
        strokeOrderSvg: makeSvg('人'),
        vocab: ['人 【ひと】person', '日本人 【にほんじん】Japanese person', '友人 【ゆうじん】friend', '大人 【おとな】adult'],
      },
      {
        character: '本',
        strokeCount: 5,
        grade: 1,
        meanings: 'book, origin, main',
        onyomiReadings: ['ホン'],
        kunyomiReadings: ['もと'],
        strokeOrderSvg: makeSvg('本'),
        vocab: ['本 【ほん】book', '日本 【にほん】Japan', '本当 【ほんとう】truth', '基本 【きほん】basics'],
      },
      {
        character: '中',
        strokeCount: 4,
        grade: 1,
        meanings: 'in, inside, middle, center',
        onyomiReadings: ['チュウ'],
        kunyomiReadings: ['なか'],
        strokeOrderSvg: makeSvg('中'),
        vocab: ['中 【なか】inside', '中国 【ちゅうごく】China', '一日中 【いちにちじゅう】all day long', '中心 【ちゅうしん】center'],
      },
      {
        character: '大',
        strokeCount: 3,
        grade: 1,
        meanings: 'large, big',
        onyomiReadings: ['ダイ', 'タイ'],
        kunyomiReadings: ['おお-', 'おお.きい'],
        strokeOrderSvg: makeSvg('大'),
        vocab: ['大きい 【おおきい】big', '大学 【だいがく】university', '大変 【たいへん】terrible, very', '大切 【たいせつ】important'],
      },
      {
        character: '小',
        strokeCount: 3,
        grade: 1,
        meanings: 'small, little',
        onyomiReadings: ['ショウ'],
        kunyomiReadings: ['ちい.さい', 'こ-'],
        strokeOrderSvg: makeSvg('小'),
        vocab: ['小さい 【ちいさい】small', '小学校 【しょうがっこう】elementary school', '小鳥 【ことり】small bird'],
      },
      {
        character: '一',
        strokeCount: 1,
        grade: 1,
        meanings: 'one',
        onyomiReadings: ['イチ', 'イツ'],
        kunyomiReadings: ['ひと-', 'ひと.つ'],
        strokeOrderSvg: makeSvg('一'),
        vocab: ['一つ 【ひとつ】one', '一人 【ひとり】one person', '一番 【いちばん】number one', '一日 【ついたち】1st of month'],
      },
      {
        character: '二',
        strokeCount: 2,
        grade: 1,
        meanings: 'two',
        onyomiReadings: ['ニ', 'ジ'],
        kunyomiReadings: ['ふた-', 'ふた.つ'],
        strokeOrderSvg: makeSvg('二'),
        vocab: ['二つ 【ふたつ】two', '二人 【ふたり】two people', '二月 【にがつ】February'],
      },
      {
        character: '三',
        strokeCount: 3,
        grade: 1,
        meanings: 'three',
        onyomiReadings: ['サン', 'ゾン'],
        kunyomiReadings: ['み-', 'み.つ', 'みっ.つ'],
        strokeOrderSvg: makeSvg('三'),
        vocab: ['三つ 【みっつ】three', '三人 【さんにん】three people', '三月 【さんがつ】March'],
      },
      {
        character: '四',
        strokeCount: 5,
        grade: 1,
        meanings: 'four',
        onyomiReadings: ['シ'],
        kunyomiReadings: ['よ-', 'よ.つ', 'よっ.つ', 'よん'],
        strokeOrderSvg: makeSvg('四'),
        vocab: ['四つ 【よっつ】four', '四人 【よにん】four people', '四月 【しがつ】April'],
      },
      {
        character: '五',
        strokeCount: 4,
        grade: 1,
        meanings: 'five',
        onyomiReadings: ['ゴ'],
        kunyomiReadings: ['いつ-', 'いつ.つ'],
        strokeOrderSvg: makeSvg('五'),
        vocab: ['五つ 【いつつ】five', '五人 【ごにん】five people', '五月 【ごがつ】May'],
      },
      // Grade 2
      {
        character: '行',
        strokeCount: 6,
        grade: 2,
        meanings: 'going, journey, carry out',
        onyomiReadings: ['コウ', 'ギョウ', 'アン'],
        kunyomiReadings: ['い.く', 'ゆ.く', 'おこな.う'],
        strokeOrderSvg: makeSvg('行'),
        vocab: ['行く 【いく】to go', '旅行 【りょこう】travel', '銀行 【ぎんこう】bank', '行動 【こうどう】action'],
      },
      {
        character: '来',
        strokeCount: 7,
        grade: 2,
        meanings: 'come, due, next, cause',
        onyomiReadings: ['ライ', 'タイ'],
        kunyomiReadings: ['く.る', 'きた.る'],
        strokeOrderSvg: makeSvg('来'),
        vocab: ['来る 【くる】to come', '来年 【らいねん】next year', '未来 【みらい】future', '本来 【ほんらい】originally'],
      },
      {
        character: '食',
        strokeCount: 9,
        grade: 2,
        meanings: 'eat, food',
        onyomiReadings: ['ショク', 'ジキ'],
        kunyomiReadings: ['く.う', 'た.べる'],
        strokeOrderSvg: makeSvg('食'),
        vocab: ['食べる 【たべる】to eat', '食事 【しょくじ】meal', '食堂 【しょくどう】cafeteria', '朝食 【ちょうしょく】breakfast'],
      },
      {
        character: '見',
        strokeCount: 7,
        grade: 2,
        meanings: 'see, hopes, chances, idea',
        onyomiReadings: ['ケン'],
        kunyomiReadings: ['み.る', 'み.える', 'み.せる'],
        strokeOrderSvg: makeSvg('見'),
        vocab: ['見る 【みる】to see', '見学 【けんがく】field trip', '意見 【いけん】opinion', '発見 【はっけん】discovery'],
      },
      {
        character: '聞',
        strokeCount: 14,
        grade: 2,
        meanings: 'hear, ask, listen',
        onyomiReadings: ['ブン', 'モン'],
        kunyomiReadings: ['き.く', 'き.こえる'],
        strokeOrderSvg: makeSvg('聞'),
        vocab: ['聞く 【きく】to listen', '新聞 【しんぶん】newspaper', '聞き手 【ききて】listener'],
      },
      // Grade 3
      {
        character: '旅',
        strokeCount: 10,
        grade: 3,
        meanings: 'trip, travel',
        onyomiReadings: ['リョ'],
        kunyomiReadings: ['たび'],
        strokeOrderSvg: makeSvg('旅'),
        vocab: ['旅行 【りょこう】travel', '旅人 【たびびと】traveler', '旅館 【りょかん】Japanese inn'],
      },
      {
        character: '運',
        strokeCount: 12,
        grade: 3,
        meanings: 'carry, luck, destiny, transport',
        onyomiReadings: ['ウン'],
        kunyomiReadings: ['はこ.ぶ'],
        strokeOrderSvg: makeSvg('運'),
        vocab: ['運転 【うんてん】driving', '運動 【うんどう】exercise', '運命 【うんめい】destiny', '運ぶ 【はこぶ】to carry'],
      },
      // Grade 4
      {
        character: '愛',
        strokeCount: 13,
        grade: 4,
        meanings: 'love, affection, favorite',
        onyomiReadings: ['アイ'],
        kunyomiReadings: ['いと.しい', 'まな'],
        strokeOrderSvg: makeSvg('愛'),
        vocab: ['愛 【あい】love', '愛情 【あいじょう】affection', '愛読 【あいどく】favorite reading'],
      },
      // Grade 5
      {
        character: '桜',
        strokeCount: 10,
        grade: 5,
        meanings: 'cherry blossom',
        onyomiReadings: ['オウ'],
        kunyomiReadings: ['さくら'],
        strokeOrderSvg: makeSvg('桜'),
        vocab: ['桜 【さくら】cherry blossom', '桜花 【おうか】cherry blossoms', '桜色 【さくらいろ】cherry blossom pink'],
      },
      // Grade 6
      {
        character: '潮',
        strokeCount: 15,
        grade: 6,
        meanings: 'tide, salt water, opportunity',
        onyomiReadings: ['チョウ'],
        kunyomiReadings: ['しお', 'うしお'],
        strokeOrderSvg: makeSvg('潮'),
        vocab: ['満潮 【まんちょう】high tide', '風潮 【ふうちょう】trend', '潮風 【しおかぜ】sea breeze'],
      },
      // Grade 7 (Secondary / Junior High)
      {
        character: '恋',
        strokeCount: 10,
        grade: 7,
        meanings: 'romance, in love, yearn for',
        onyomiReadings: ['レン'],
        kunyomiReadings: ['こい', 'こい.しい'],
        strokeOrderSvg: makeSvg('恋'),
        vocab: ['恋 【こい】romantic love', '恋愛 【れんあい】love, romance', '恋人 【こいびと】lover, sweetheart'],
      },
    ];

    await this.kanjiRepo.save(kanjiData);
    this.logger.log(`Seeded ${kanjiData.length} Kanji characters.`);
  }

  private async seedParticles() {
    const count = await this.particleRepo.count();
    if (count > 0) return;

    this.logger.log('Seeding Japanese particles...');
    const particleData: Partial<Particle>[] = [
      {
        particle: 'は (wa)',
        meaning: 'topic marker',
        description: 'Follows the topic the speaker wants to talk about.',
        formation: '[ A ] wa [ B ] desu. [ A ] is [ B ].',
        example: 'Kinō wa ame datta 【昨日は雨だった】 It was rainy yesterday',
      },
      {
        particle: 'が (ga)',
        meaning: 'subject marker / identifier',
        description: 'Identifies the specific subject performing the action or having the quality, often emphasizing the subject.',
        formation: '[ Subject ] ga [ Verb / Adjective ]',
        example: 'Ame ga futte iru 【雨が降っている】 It is raining',
      },
      {
        particle: 'を (o / wo)',
        meaning: 'direct object marker',
        description: 'Indicates the object that receives the action of a transitive verb.',
        formation: '[ Noun ] o [ Verb ]',
        example: 'Hon o yomu 【本を読む】 Read a book',
      },
      {
        particle: 'に (ni)',
        meaning: 'target / time / destination marker',
        description: 'Indicates the destination of movement, a specific point in time, an indirect object, or the location where something exists.',
        formation: '[ Place / Time ] ni [ Verb ]',
        example: 'Tōkyō ni ikimasu 【東京に行きます】 I will go to Tokyo',
      },
      {
        particle: 'で (de)',
        meaning: 'location of action / means / tool marker',
        description: 'Specifies where an event or action occurs, or the method/means used to perform an action.',
        formation: '[ Tool / Place ] de [ Action ]',
        example: 'Densha de gakkō e iku 【電車で学校へ行く】 Go to school by train',
      },
      {
        particle: 'へ (e)',
        meaning: 'direction marker',
        description: 'Indicates the physical or metaphorical direction toward a goal or destination.',
        formation: '[ Destination ] e [ Movement Verb ]',
        example: 'Nihon e ikitai 【日本へ行きたい】 I want to go to Japan',
      },
      {
        particle: 'と (to)',
        meaning: 'and / with marker',
        description: 'Connects multiple nouns exhaustively, or indicates companionship ("with someone").',
        formation: '[ Noun ] to [ Noun ] / [ Person ] to [ Verb ]',
        example: 'Tomodachi to hanasu 【友達と話す】 Talk with a friend',
      },
      {
        particle: 'も (mo)',
        meaning: 'also / too / as well',
        description: 'Replaces wa, ga, or o to indicate that the same statement applies to another subject or object.',
        formation: '[ Noun ] mo [ Verb / Adj ]',
        example: 'Watashi mo gakusei desu 【私も学生です】 I am also a student',
      },
      {
        particle: 'から (kara)',
        meaning: 'from (source / starting point) / because',
        description: 'Indicates the starting point in space or time, or acts as a conjunction expressing a reason or cause.',
        formation: '[ Starting Point ] kara',
        example: 'Ku-ji kara hajimaru 【九時から始まる】 Starts from nine o’clock',
      },
      {
        particle: 'まで (made)',
        meaning: 'until / up to / as far as',
        description: 'Indicates the terminus, limit, or destination in time or distance.',
        formation: '[ End Point ] made',
        example: 'Tōkyō kara Kyōto made 【東京から京都まで】 From Tokyo to Kyoto',
      },
      {
        particle: 'より (yori)',
        meaning: 'comparison / more than',
        description: 'Used in comparisons to denote the reference point ("more than [Noun]").',
        formation: '[ A ] wa [ B ] yori [ Adj ]',
        example: 'Inu wa neko yori ōkii 【犬は猫より大きい】 Dogs are bigger than cats',
      },
      {
        particle: 'ね (ne)',
        meaning: 'agreement seeker / tag question ("isn’t it?")',
        description: 'Placed at the end of a sentence to seek agreement, confirmation, or show empathy with the listener.',
        formation: '[ Sentence ] ne',
        example: 'Ii tenki desu ne 【いい天気ですね】 Nice weather, isn’t it?',
      },
      {
        particle: 'よ (yo)',
        meaning: 'assertion / information emphasis',
        description: 'Placed at sentence end to give new information or assert conviction with emphasis.',
        formation: '[ Sentence ] yo',
        example: 'Ashita wa yasumi desu yo 【明日は休みですよ】 Tomorrow is a holiday, you know!',
      },
      {
        particle: 'か (ka)',
        meaning: 'question marker',
        description: 'Transforms a statement into a question at the end of a sentence.',
        formation: '[ Sentence ] ka',
        example: 'Kore wa nan desu ka 【これは何ですか】 What is this?',
      },
      {
        particle: 'の (no)',
        meaning: 'possession / modifier marker ("\'s" / "of")',
        description: 'Connects two nouns where the first modifies the second, indicating possession or relationship.',
        formation: '[ Noun A ] no [ Noun B ]',
        example: 'Watashi no hon 【私の本】 My book',
      },
    ];

    await this.particleRepo.save(particleData);
    this.logger.log(`Seeded ${particleData.length} Japanese particles.`);
  }

  private async seedDemoUserAndFlashcards() {
    let demoUser = await this.userRepo.findOne({ where: { username: 'demo' } });
    if (!demoUser) {
      this.logger.log('Seeding demo user (demo / password123)...');
      demoUser = this.userRepo.create({
        username: 'demo',
        email: 'demo@kitsuno.app',
        password: await bcrypt.hash('password123', 10),
        enabled: true,
        joinDate: new Date().toISOString().split('T')[0],
        apiKey: 'demo-api-key-1234567890abcdef',
        verificationToken: null,
      });
      demoUser = await this.userRepo.save(demoUser);
      this.logger.log('Created demo user: demo / password123');
    }

    const flashcardCount = await this.flashcardRepo.count({ where: { user: { id: demoUser.id } } });
    if (flashcardCount === 0) {
      this.logger.log('Seeding demo flashcards...');
      const kanjiNich = await this.kanjiRepo.findOne({ where: { character: '日' } });
      const kanjiTsuki = await this.kanjiRepo.findOne({ where: { character: '月' } });
      const kanjiMizu = await this.kanjiRepo.findOne({ where: { character: '水' } });

      const flashcards: Partial<Flashcard>[] = [];
      if (kanjiNich) {
        flashcards.push({
          user: demoUser,
          kanji: kanjiNich,
          notes: 'Important foundation kanji for days and Japan.',
          vocabulary: ['毎日 【まいにち】every day', '日曜日 【にちようび】Sunday'],
        });
      }
      if (kanjiTsuki) {
        flashcards.push({
          user: demoUser,
          kanji: kanjiTsuki,
          notes: 'Moon and month kanji. Remember Monday is 月曜日.',
          vocabulary: ['月曜 【げつよう】Monday', '今月 【こんげつ】this month'],
        });
      }
      if (kanjiMizu) {
        flashcards.push({
          user: demoUser,
          kanji: kanjiMizu,
          notes: 'Water kanji. Looks like water splashing!',
          vocabulary: ['水 【みず】water', '水泳 【すいえい】swimming'],
        });
      }

      if (flashcards.length > 0) {
        await this.flashcardRepo.save(flashcards);
        this.logger.log(`Created ${flashcards.length} initial flashcards for demo user.`);
      }
    }
  }
}
