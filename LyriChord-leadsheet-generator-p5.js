const input_file = 'Rockin Robin.txt';	// Input filename (in LyriChord format)

// The following parameters can be read in as Directives from input file
var tempo = 120; 					// Tempo, in beats-per-minute (bpm)
var title = "";						// Title of the song
var artist = "";
var beats_per_measure;		// Time signature numerator
var beat_note;						// Time signature denominator
var key = "C";

// Staff and line spacing defaults
const staffMargin = 50;		// Left and right margins
const staffSpacing = 120;	// Spacing between staff lines
const staffHeight = 15;
const beatsPerLine = 8;		// Deprecated (should be computed from each line of input file)
const beatMargin = 30;		// Spacing between edge of staff to first/last beat marker
const beatSize = 10;			// Diameter of beat marker
const symbol_radius = 25;
const chord_offset = 20;
const lyric_offset = 30;
const staff_top = 50;
var document_top = 50;
const title_top = 20;
const font_size = 12;
const chord_size = 16;
const title_size = 20;
const title_spacing = 90;
const artist_spacing = 30;
const comment_spacing = 50;

// Temporary hacks (removed)
//const input_file_line_spacing = 2;
//const lines_to_show = 7;	// Lines to display on screen

const beatMark = ".";

// Debug flags
const debug = false; // true;
const debug2 = false;
const debug_lyrics = false;
const debug_chords = false;
const debug_directives = false;
const debug_beats = false;

var staff_y = 100;
var beatSpacing = 50;			// 50 is just a placeholder, it's recomputed each line
var beats_this_line = 8;		// 8 is a placeholder, recomputed each line
var dict = [];
var lineNumber = 0;						// Top visisble line number of input file
var currentAlpha = 1.0;
var beatCounter = 0.0;
var scrollSwitch = 0;			// +1 (forward), 0, -1 (reverse)
var lyricSwitch = false;
var directives = [];
const backgroundColor = 255;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(backgroundColor);	

	textLines = readLyriChordFile(input_file);
	parseDirectives();
	if (debug) { console.log("textLines: " + textLines); }
	
	staff_y = document_top;

	redrawAll();
	count = 0;
	fRate = 60;
}

function draw() {
	// Refresh screen frames (only when scrolling is triggered)
	if (scrollSwitch != 0) {
		count += 10;
		staff_y -= 10 * scrollSwitch;
		document_top -= 10 * scrollSwitch;
		if (debug) { console.log('count: ' + count + ', staff_y: ' + staff_y + ', document_top: '+document_top); }
	
		if (count >= staffSpacing) {
			count = 0;
			scrollSwitch = 0;
//			lyricSwitch = false;
//			startHighlight = false;

			fRate = getFrameRate();
		}	
		redrawAll();
	}	
}

function redrawAll() {
	// Draw all components for the current screen frame
	background(backgroundColor);

	if (staff_y >= title_top && staff_y+lyric_offset < height) {
		drawTitle();
	}
	staff_y += staffSpacing; // ASSUMES drawTitle takes same amount of staff_y space as staffSpacing
	
	let n = 0;
	let first_visible_line = -1;
	while ( n < textLines.length ) {

		thisLine = textLines[n];

		directiveMatch = thisLine.match(/\{.*?\}/g);
		if ( directiveMatch != undefined ) {
			// It's a directive
			staff_y -= comment_spacing;
			if (staff_y >= title_top && staff_y+lyric_offset < height) {
				if (first_visible_line == -1) { first_visible_line = n; }
				drawComment(thisLine.replace(/\{|\}/gi,'') );
			}
			staff_y += comment_spacing;
			n++;
		}

		if (staff_y >= title_top && staff_y+lyric_offset < height) {
			if (first_visible_line == -1) { first_visible_line = n; }
			beats_this_line = drawChords(textLines[n]);
			if (debug) { console.log('Beats this line: ' + beats_this_line); }
			lyricsLine = textLines[n+1];
			drawLyrics( lyricsLine );
			drawStaff(beats_this_line);
			drawBeatMarkers(beats_this_line);
		}

		staff_y += staffSpacing;
		n += 2;
	}
	lineNumber = first_visible_line;
	staff_y = document_top; // reset for next frame
}


function keyPressed() {
	count = 0;
	beatCounter = 0.0;
	
	if (debug) { console.log('line: ' + lineNumber); }

	if (keyCode === LEFT_ARROW) {
		if (lineNumber > 0) {
			scrollSwitch = -1;
		}
	}
	else {
		if (lineNumber < textLines.length - 2) {
			scrollSwitch = 1;
//			lyricSwitch = false;
		}
	}
}
