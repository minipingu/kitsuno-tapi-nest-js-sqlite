import sys
import genanki
import json
import random
import io

with open(sys.argv[1], 'r', encoding='utf-8') as json_file:
    flashcards_data = json.load(json_file)

model = genanki.Model(
    random.randint(1000000000, 9999999999),
    "Kanji Flashcard Model",
    fields=[
        {"name": "Kanji"},
        {"name": "Notes"},
        {"name": "Kunyomi"},
        {"name": "Onyomi"},
        {"name": "Meaning"},
        {"name": "Vocabulary"},
    ],
    templates=[
        {
            "name": "Kanji Card",
            "qfmt": "<div class='flashcard-front' style='text-align: center; font-size: 20px;'>"
                     "<h1>{{Kanji}}</h1>"
                     "<p>{{Notes}}</p>"
                     "</div>",
            "afmt": "<div class='flashcard-back' style='text-align: center; font-size: 18px;'>"
                     "<h1>{{Kanji}}</h1>"
                     "<p><b>Kunyomi:</b> {{Kunyomi}}</p>"
                     "<p><b>Onyomi:</b> {{Onyomi}}</p>"
                     "<p><b>Meaning:</b> {{Meaning}}</p>"
                     "<p><b>Vocabulary:</b> {{Vocabulary}}</p>"
                     "</div>",
        }
    ]
)

deck = genanki.Deck(
    random.randint(1000000000, 9999999999),
    "Kitsuno Flashcards"
)

for card in flashcards_data:
    note = genanki.Note(
        model=model,
        fields=[card[0], card[1], card[2], card[3], card[4], card[5]]
    )
    deck.add_note(note)

package = genanki.Package(deck)

output_stream = io.BytesIO()
package.write_to_file(output_stream)

output_stream.seek(0)

sys.stdout.buffer.write(output_stream.read())
