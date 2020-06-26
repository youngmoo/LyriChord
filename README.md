# LyriChord
*A human- and machine-readable format for music lyric+chord charts*

This project started from my desire to have a text-based format for lyric+chord charts (lead sheets) that could be parsed by machines while also remaining easy to read (and create/edit) by humans. The concept is heavily influenced by [Markdown](https://daringfireball.net/projects/markdown/), which is what I'm using to write this README.

LyriChord is also inspired by other text-based music formats. Rather than traditional music notation (staves and notes), I find myself learning music and performing more and more simply from lyric+chord charts. The number of people who can read and learn music from lyrics+chords is substantially higher than those who read traditional notation, particularly with nearly every song ever written available in this form from sites like [Ultimate Guitar](https://www.ultimate-guitar.com). These sites probably have a proprietary representation/format they use, but it's not an open standard and there are some general deficiences (detailed below). I've borrowed heavily from [ChordPro](https://www.chordpro.org), an open specification also targeting this application (see the [GitHub repo and reference implementation](https://github.com/ChordPro/chordpro)). But my primary issue with ChordPro (and similar formats) is human readability. Here's an example in ChordPro (from *Birdhouse in Your Soul* by They Might Be Giants):

```
[C]Blue ca[C/E]nary in the [F]outlet by the light switch
[C/G]Who watches [F/A]over [G/B]you
[C]Make a [G/B]little [F/A]birdhouse [F]in your [Eb]soul
```

It takes some mental effort to extract the lyrics from the chords, especially when chord changes fall in the middle of a word. This makes it difficult to read and, particularly, perform from this format (I realize that's not necessarily the intention of ChordPro, but my goal is something that is natively human-readable). Here's the more traditional freeform 'abc' text format, which is easier to read, but doesn't address my second major issue with most music/chord formats: they don't provide much, if anything, in terms of rhythmic cues.
```
C      C/E         F
Blue canary in the outlet by the light switch

C/G         F/A  G/B
Who watches over you

C      G/B    F/A       F       Eb
Make a little birdhouse in your soul
```
Now, here's the same passage in LyriChord:

```
.C       .C/E         .F             .
. Blue ca.nary in the .outlet by the .light switch

.C/G  .        .F/A  .G/B
. Who .watches .over .you

.C       .G/B    .F/A       .F       .Eb
. Make a .little .birdhouse .in your .soul
```

Perhaps it's not beautiful, but to my eyes it's legible and more informative. You could even play/perform from it, if needed, and it makes it easy to spot alignment errors. LyriChord uses periods to provide an obvious indication of where the beats (and chords) fall, also providing a sense of when chords and syllabus are off the beat. The periods are intended to be as unobtrusive as possible, allowing you to still easily read the words, even when beats fall in the middle of a word. Here's an example from a different song about a bird:

```
.G/D .A7/C#     .Am7/C . .Cm .
.All .your life .      . .   .

.G/B      .     .A7      .          .Am7/D  .D7  .G     . . .
.You were .only .wait-ing .for this .mo-ment .to a.rise . . .

```

In designing LyriChord, I have three main objectives:
1. Make it easy to create and edit lyric+chord sheets.
2. Make it easy to read natively, so that a song can be learned and performed, even from the source text.
3. Make it unambigious and machine-readable, so it can be formatted into something nicer (a la Markdown >> HTML).
    - This repo includes JavaScript code (p5.js) to parse an input file and format it into a lead sheet. [Here's a quick and dirty demo implementation.](https://www.openprocessing.org/sketch/921161/) (JavaScript is a pretty terrible language for text parsing, and I'm sure this could be done far better and more elegantly in another language.)
    - Hopefully, this will also enable other applications, such as integration with apps for live music performance and [Music IR research](https://www.ismir.net).
    - For example, I made a simple [web app musical instrument (for phones)](https://bit.ly/tedxsong) for audiences to "play along" with a live performance, guided by visual cues. I made another web app (in p5.js) that now uses LyriChord [to generate those visual cues](https://www.openprocessing.org/sketch/876713).

LyriChord format
---

- Each line of lyrics should be aligned with whole measures (bars) of a song
  - Periods `.` indicate beats within the lyrics
  - In the example below, the line is 2 bars (8 beats in 4/4 time)...
  - Lyrics and chords before the first beat (pickups) are allowed
- Chords are presented above the lyric line using standard (C,C7,C7/E,Cm,Cm7,etc.) text chord labels
  - Again, periods `.` indicate beat locations, which must match the number of beats in the lyric line
  - The periods can be aligned with beats in the lyrics, but it isn't required.
  - (In the future, we may consider not requiring empty beats at the end of a line, when no lyric or chord changes are indicated.)
- In general, spaces and empty lines are ignored, so these can be used to visually align elements--best results when using a [monospaced font](https://en.wikipedia.org/wiki/Monospaced_font).
  - The vertical bar `|` can also be used to indicate measure breaks, but it is ignored.
  - Thus, the following two passages are equivalent (though the latter is likely more difficult to read):

```
.G         .Am7            .G/B           | . . . .
.Blackbird .singing in the .dead of night | . . . .

.C          .A7/C#        .D    .B7/D#        | .Em .Cm/Eb .
.Take these .broken wings . and .learn to fly | . . .      .

.G/D .A7/C#     .Am7/C | . .Cm .
.All .your life .      | . .   .

.G/B      .     .A7       | .         .Am7/D   .D7  .|G    . . .
.You were .only .wait-ing | .for this .mo-ment .to a.|rise . . .
```
```
.G.Am7.G/B....
.Blackbird .singing in the .dead of night....

.C.A7/C#.D.B7/D#.Em.Cm/Eb.
.Take these .broken wings . and .learn to fly....

.G/D.A7/C#.Am7/C..Cm.
.All .your life....

.G/B..A7..Am7/D.D7.G...
.You were .only .wait-ing .for this .mo-ment .to a.rise...
```
- The beginning and end of a repeated phrase can be indicated using the colon `:`, with the number of colons indicating the number of *additional* repeats. In the example below, the first line is played a total of *three times* (continuing with the bird theme... excerpt from *Rockin Robin*, by Leon René under the pseudonym Jimmie Thomas, as performed by Bobby Day):

```
|:: .         .G       .    .G | . .D7       .        .D7  ::|
|:: .Tweedily .deedily .dee .  | . .Tweedily .deedily .dee ::|

.       .G.       .G | . .G     .       .G
.Tweet, . .tweet, .  | . .tweet .tweet! . 
```

- Most ChordPro *directives* are supported
  - Use braces `{}` to indicate directives
  - Markers, comments, and meta-data can also be included within brackets
```
{title: Rockin' Robin}
{artist: Bobby Day}
{time: 4/4}
{key: G}
{tempo: 175} 
{intro}
{verse}
{chorus}
{comments...}
```

- Unimplemented, but probably good ideas...
  - Since periods, colons, and bars are reserved characters, there should be some way to escape those (perhaps `\`) if they are part of the lyrics.

This is very much an early draft of a work in progress, and I welcome any and all feedback. I hope this is useful to you!
