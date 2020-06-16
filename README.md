# LyriChord
*A human- and machine-readable format for music lyric+chord charts*

This project started from my desire to have a text-based format for lyric+chord charts (lead sheets) that could be parsed by machines while also remaining easy to read (and create/edit) by humans. The concept is heavily inspired by [Markdown](https://daringfireball.net/projects/markdown/), which is what I'm using to write this README.

LyriChord is also inspired by other text-based music formats. Rather than traditional music notation (staves and notes), I find myself learning music and performing more and more simply from lyric+chord charts. The number of people who can read and learn music from lyrics+chords is substantially higher than those who read traditional notation, particularly with nearly every song ever written available in this form from sites like [Ultimate Guitar](https://www.ultimate-guitar.com). These sites probably have a proprietary representation/format they use, but it's not an open standard and there are some general deficiences (detailed below). I've borrowed heavily from [ChordPro](https://www.chordpro.org), an open specification also targeting this application (see the [GitHub repo and reference implementation](https://github.com/ChordPro/chordpro)). But my primary issue with ChordPro (and similar formats) is human readability. Here's an example in ChordPro (from *Birdhouse in Your Soul* by They Might Be Giants):

```
[C]Blue ca[C/E]nary in the [F]outlet by the light switch
[C/G]Who watches [F/A]over [G/B]you
[C]Make a [G/B]little [F/A]birdhouse [F]in your [Eb]soul
```

It takes some mental effort to extract the lyrics from the chords, especially when chord changes fall in the middle of a word. This makes it difficult to read and, particularly, perform from this format (I realize that's not necessarily the intention of ChordPro, but my goal is something that is natively human-readable). Here's the same passage in LyriChord:

```
.C       .C/E         .F             .
. Blue ca.nary in the .outlet by the .light switch

.C/G  .        .F/A  .G/B
. Who .watches .over .you

.C       .G/B    .F/A       .F       .Eb
. Make a .little .birdhouse .in your .soul
```

Perhaps it's not beautiful, but to my eyes it's more legible. It's also easier to spot errors, and you could even perform from it, if needed. LyriChord also addresses my second major issue with many text-based music/chord formats: they don't provide much, if anything, in terms of rhythmic cues. LyriChord uses periods to provide an obvious indication of where the beats (and chords) fall, also providing a sense of when chords and syllabus are off the beat. The periods are intended to be as unobtrusive as possible, allowing you to still easily read the words, even beats fall in the middle of a word (example from *Wonderful World* by Sam Cooke):

```
..G          .      .G    .   .Em     ..Em
..Don't know .much a.bout .his.to-ry ..

..C          .     .C . .D .   .D
..Don't know .much .bi.o.lo.gy .
```

Ultimately, in designing LyriChord, I have three main objectives:
1. Make it easy to create and edit lyric+chord sheets.
2. Make it easy to read natively, so that a song can be learned and performed, even from the source text.
3. Make it unambigious and machine-readable, so it can be formatted into something nicer (a la Markdown >> HTML).
    - Hopefully, this will also enable other applications, such as integration with apps for live music performance and [Music IR research](https://www.ismir.net).
    - For example, I made a simple web app musical instrument (for phones) for audiences to "play along" with a live performance, guided by visual cues. I made another web app (in p5.js) that uses LyriChord to generate those visual cues.

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
..G          .      .G    | .   .Em    ..Em
..Don't know .much a.bout | .his.to-ry ..
```
```
..G..G..Em..Em
..Don't know .much a.bout .his.to-ry ..
```
- The beginning and end of a repeated phrase can be indicated using the colon `:`, with the number of colons indicating the number of *additional* repeats. In the example below, the line is played a total of *three times* (from *Rockin Robin*, by Leon René under the pseudonym Jimmie Thomas, as performed by Bobby Day):

```
|:: .         .G       .    .G | . .D7       .        .D7  ::|
|:: .Tweedily .deedily .dee .  | . .Tweedily .deedily .dee ::|
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

This is very much a work in progress, and I welcome any and all feedback. I hope this is useful to you!
