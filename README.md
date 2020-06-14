# LyriChord
A human- and machine-readable format for music lyric+chord charts.

I started this project from my desire to have a text-based format for lyric+chord charts (lead sheets) that could be parsed by machines while also remaining easy to read (and create/edit) by humans. The concept is heavily inspired by [Markdown](https://daringfireball.net/projects/markdown/), which is what I'm using to write this README.

LyriChord is also inspired by other text-based music formats. But rather than traditional music notation (staves and notes), I find myself learning music and performing more and more simply from lyrics+chords. I think the number of people who can read and learn from lyric+chord charts is much higher than those who read traditional notation, particularly with nearly every song ever written available in this form from sites like [Ultimate Guitar](https://www.ultimate-guitar.com). These sites probably have a proprietary representation/format they use, but it's not an open standard and there are some general deficiences (detailed below). [ChordPro](https://www.chordpro.org), which I borrow heavily from, is an open specification also targeting this application (see the [GitHub repo and reference implementation](https://github.com/ChordPro/chordpro)). My primary issue with ChordPro (and similar formats) is human readability. Here's an example in ChordPro (from They Might Be Giants' classic, *Birdhouse in Your Soul*):

```
[C]Blue ca[C/E]nary in the [F]outlet by the light switch
[C/G]Who watches [F/A]over [G/B]you
[C]Make a [G/B]little [F/A]birdhouse [F]in your [Eb]soul
```

It takes some mental effort to extract the lyrics from the chord, especially when the chord changes fall in the middle of a word. This makes it difficult to read and, particularly, perform from this format (I know that's not necessarily the intention of ChordPro, but my goal is something that is natively human-readable). Here's the same passage in LyriChord:

```
.C       .C/E         .F             .
. Blue ca.nary in the .outlet by the .light switch

.C/G  .        .F/A  .G/B
. Who .watches .over .you

.C       .G/B    .F/A       .F       .Eb
. Make a .little .birdhouse .in your .soul
```

Perhaps it's not beautiful, but I believe its more legible. It's easier to spot errors, and you could even perform from it, if needed. It also addresses my second major issue with many text-based music/chord formats: they don't provide anything in terms of rhythmic cues. LyriChord uses periods to provide an obvious indication of where the beats (and chords) fall, also providing a sense of when chords and syllabus are off the beat. The periods are intended to be as unobtrusive as possible, allowing you to still easily read the words, even beats fall in the middle of a word:

```
..G          .      .G    .   .Em     ..Em
..Don't know .much a.bout .his.to-ry ..

..C          .     .C . .D .   .D
..Don't know .much .bi.o.lo.gy .

(from Wonderful World, by Sam E. Cooke)
```

Ultimately, in designing LyriChord, I have three main objectives:
1. Make it easy to create and edit lyric+chord sheets.
2. It should be easy to read natively, so that a song can be learned and performed, even from the source text.
3. Make it unambigious and machine-readable, so it can be formatted into something nicer (a la Markdown >> HTML).
  - Hopefully, it will also enable other applications, such as integration with apps for live music performance and [Music IR research](https://www.ismir.net).
  - For example, I have made a simple web app musical instrument (for phones) for audiences to "play along" with a live performance, guided by visual cues. I made another web app (in p5.js) that uses LyriChord to generate those visual cues.

LyriChord format
---

- Each line of lyrics should be aligned with whole measures (bars) of a song
  - Periods `.` indicate beats within the lyrics
  - For example, the following line is 2 bars (8 beats in 4/4 time)...
- Chords are presented above the lyric line using standard (A,Am,Am7) text chord labels
  - Again, periods `.` indicate beat locations, which must match the number of beats in the lyric line
  - The periods can be aligned with beats in the lyrics, but it isn't required.
- In general, whitespace is ignored (spaces and empty lines), so that spaces can be used to visually align things.
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
- The beginning and end of a repeated phrase can be indicated using the colon `:`, with the number of colons indicating the number of repetitions. 

```
|::: .         .G       .    .G | . .D7       .        .D7  :::|
|::: .Tweedily .deedily .dee .  | . .Tweedily .deedily .dee :::|
```

- Most ChordPro directives are supported
  - Use braces `{}` to indicate directives and meta-data.

```
{title: Rockin' Robin}
{artist: Bobby Day}
{time: 4/4}
{key: G}
{tempo: 175} 

{chorus}
```

This is very much a work in progress, and I welcome any and all feedback. I hope this is useful to you!
