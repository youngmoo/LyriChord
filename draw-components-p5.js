// Component drawing functions for:
//	title, staff, beat markers, lyrics, comments

function drawTitle() {
	if (title != "") {
		fill(0);
		noStroke();
		textSize(title_size);
		textStyle(BOLD);
		textAlign(CENTER);
		text(title, width/2, staff_y);
		
		if (artist != "") {
			textSize(title_size - 2);
			textStyle(NORMAL)
			text("by "+artist,width/2, staff_y + artist_spacing);
		}
	}
}


function drawStaff(beats_this_line) {
	// Draw staff
//	stroke(0);
	stroke('rgba(0,0,0,' + currentAlpha + ')');
	strokeWeight(1);
	line(staffMargin, staff_y-staffHeight,staffMargin, staff_y+staffHeight);
	line(staffMargin, staff_y, width-staffMargin, staff_y);
	line(width-staffMargin, staff_y-staffHeight,width-staffMargin, staff_y+staffHeight);

	// Measure line
	strokeWeight(1);
//	measure_x = width/2;
	// YK - For now, we just draw these according to number of beats and time signature
	// Eventually, we should allow an override by measure marks (|)
//	measure_x = staffMargin + beatSpacing*(beats_per_measure+0.5);
	measure_x = staffMargin + beatMargin + beatSpacing*(beats_per_measure-0.5);
	
	for (m=beats_per_measure; m<beats_this_line; m+= beats_per_measure) {
//		console.log('measure_x: ' + measure_x);
		line(measure_x, staff_y-staffHeight,measure_x, staff_y+staffHeight);
		measure_x += beatSpacing * beats_per_measure;
	}
}

function drawBeatMarkers(beatsThisLine) {

//	beatSpacing = (width - 2*staffMargin - 2*beatMargin)/(beatsThisLine - 1);
	// Draw beat markers
	strokeWeight(beatSize);
//	stroke(150);
	stroke('rgba(150,150,150,' + currentAlpha + ')');
	
//	for (let n=0;n<beatsPerLine;n++) {
	
//	let beat_x = staffMargin + beatSpacing;
	let beat_x = staffMargin + beatMargin;

	for (let n=0;n<beatsThisLine;n++) {

//		let beat_x = staffMargin + beatMargin + (n*beatSpacing);
		point(beat_x, staff_y);
		beat_x += beatSpacing;
	}
}

function drawComment(commentText) {

	let this_x = staffMargin;
	let this_y = staff_y;
	
	fill(0);
	noStroke();
	textSize(chord_size);
	textStyle(BOLD);
	textAlign(LEFT);

	text(commentText,this_x,this_y);
//	console.log(commentText + ', y: ' + this_y);
}



function drawChords(chords) {
//	var chords = "..G          .      .G    .   .e     ..e";
//	var chords = ". .G . .G . .e . .e";

//	symbols = chords.split(" ");
//	dict = [];
	
	let symbol_x = staffMargin + beatMargin; // - symbol_radius;
	let symbol_y = staff_y - chord_offset;
	if (debug_chords) {  console.log("chords: " + chords); }

	chord_symbols = parseBeats(chords);
	let beats_this_line = chord_symbols.length - 1;
	
	// Set beatSpacing (used by drawStaff, etc. for this entire line)
	beatSpacing = (width - 2*staffMargin - 2*beatMargin)/(beats_this_line - 1);
	
	symbols = new Array(beats_this_line + 1).fill([]);	// Need to add 1 to length for pickup to downbeat
	// Result of parseBeats is an array of arrays, need to dereference one level for index search
	for (let n=0;n<chord_symbols.length;n++) {
		symbols[n] = chord_symbols[n][0];
	}
	if (debug_chords) { console.log('... Chords from current line: ' + symbols); }
	
	for (let n=1;n<symbols.length;n++) {
		if (symbols[n] != "") {
			// If chord is not in the dictionary, add it
			if (debug_chords) { console.log("n: " + n + ", symbol: " + symbols[n] + ", dict: " + dict); }
			if (debug_chords) { console.log("idx: " + dict.indexOf( symbols[n] )); }
			
			if (dict.indexOf( symbols[n] ) == -1) {
				if (dict.length < 4) { dict.push( symbols[n] ); }
			}

			symbol = dict.indexOf( symbols[n] );
			fill(0);
			noStroke();
			textSize(chord_size);
			textStyle(NORMAL);
			textAlign(CENTER);
			text(symbols[n], symbol_x, symbol_y);				

		}	// Symbol is not empty
		symbol_x += beatSpacing;
	}	// Loop through chord symbols in line
	
	return beats_this_line;
}	




function drawLyrics(lyric) {

	// Add lyrics below current staff
	textSize(font_size);
//	fill(0,0,0).setAlpha(currentAlpha);
	fill('rgba(0,0,0,' + currentAlpha + ')');

	noStroke();

	beat_syllables = parseBeats(lyric);

//	var lyric_x = staffMargin;
	var lyric_x = (staffMargin + beatMargin) / (beat_syllables[0].length + 1);
	let lyric_y = staff_y + lyric_offset;
//	console.log('lyric_y: '+lyric_y);
	textAlign(CENTER);
	// Syllables before the first beat
	for (let s=0; s<beat_syllables[0].length; s++) {	
		if (lyricSwitch && (staff_y == staff_top) ) {
			textStyle(BOLD);
		}
		else {
			textStyle(NORMAL);			
		}
		text(beat_syllables[0][s], lyric_x, lyric_y);
		if (debug_lyrics) { console.log('this_text: ' + beat_syllables[0][s]+', lyric_y: '+lyric_y+', staff_y: '+staff_y); }

		lyric_x += (staffMargin + beatMargin) / (beat_syllables[0].length + 1);
	}

		
//	for (let n=0; n<beatsPerLine; n++) {
	for (let n=0; n<beats_this_line; n++) {
		
		lyric_x = staffMargin + beatMargin + (n*beatSpacing);
		if (debug) { console.log(beat_syllables[n+1].length); }
		this_text = beat_syllables[n+1][0];
		if (lyricSwitch && (n <= beatCounter) && (staff_y == staff_top) ) {
			textStyle(BOLD);
			if (debug2) { console.log('lyric_y: '+lyric_y); }
			text(this_text, lyric_x, lyric_y); // index offset by 1 to align with beat number
		}
		else {
			textStyle(NORMAL);
			text(this_text, lyric_x, lyric_y); // index offset by 1 to align with beat number
		}
		lyric_x += textWidth(this_text)/2;
		
		for (let s=1; s<beat_syllables[n+1].length; s++) {
			if (n < beats_this_line - 1) {
				lyric_x += ( beatSpacing - textWidth(this_text)/2 ) / (beat_syllables[n+1].length );
			}
			else { // Special case for last beat of a line
				lyric_x += ( width - lyric_x - textWidth(beat_syllables[n+1][s-1])/2 ) / (beat_syllables[n+1].length - s + 1);
			}
			
			let sub_beat = n + s/beat_syllables[n+1].length;
			if (lyricSwitch && (sub_beat <= beatCounter) && (staff_y == staff_top) ) {
				textStyle(BOLD);
				if (debug2) { console.log('sub beat: '+sub_beat); }
				text(beat_syllables[n+1][s], lyric_x, lyric_y); // index offset by 1 to align with beat number
			}
			else {
				textStyle(NORMAL);
				text(beat_syllables[n+1][s], lyric_x, lyric_y); // index offset by 1 to align with beat number
			}
			if (debug_lyrics) { console.log('beat_syllable: ' + beat_syllables[n+1][s]); }
		}
	}	
}
