// Functions to parse LyriChord files

function readLyriChordFile(file) {
	var allText = "";
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function () {
		if(rawFile.readyState === 4) {
			if(rawFile.status === 200 || rawFile.status == 0) {
				allText = rawFile.responseText;
			}
		}
	}
	rawFile.send(null);

	lines = allText.split("\n");
	textLines = [];
	for (let n=0; n<lines.length; n++) {
		// Strip lines of line breaks and carriage returns
		lines[n] = lines[n].replace(/(\r\n|\n|\r)/gm,"");		
		
		if (debug_lyrics) { console.log('line '+n+': '+ lines[n]); }
		
		// Ignore blank lines (and any leading / trailing spaces)
		thisLine = lines[n].trim();
		directiveMatch = thisLine.match(/\{.*?\}/g);
		if ( directiveMatch != undefined ) {
			components = thisLine.split(':');
			if (debug_directives) { console.log('components: ' + components); }
			if (components.length > 1) {
				directives.push( thisLine.replace(/\{|\}/gi,'') );
			}
			else {
				textLines.push( thisLine );
			}
		}
		else if ( thisLine != "" ) {
			// Remove vertical bars
			// textLines.push(thisLine);
			textLines.push( thisLine.replace(/\|/gi,'') );
		}
	}
	if (debug_directives) { console.log('Directives: ' + directives); }
	
	return textLines;
}


// Warning: This requires global variable directives, defined in setup()
// Right now, probably only works for directives declared at the top of file
function parseDirectives() {	
	for (let n=0; n<directives.length; n++) {		
		// Parse each directive here
		components = directives[n].split(':');
		if (components.length > 0) {
			// Process directive
			switch( components[0].trim().toUpperCase() ) {
				case "TITLE":
					title = components[1];
					break;
				case "ARTIST":
					artist = components[1];
					break;
				case "TIME":
					fraction = components[1].split('/');
					beats_per_measure = Number ( fraction[0] );
					beat_note = Number ( fraction[1] );
					break;
				case "TEMPO":
					tempo = Number( components[1] );
					break;
				case "KEY":
					key = components[1].trim();
					break;
				default:
					break;
			}
		}
		else {
			// Process comments (future work)
		}
		
		if (debug_directives) {
			console.log("tempo: " + tempo);
			console.log("title: " + title);
			console.log("time signature: " + beats_per_measure + "/" + beat_note);
			console.log("key: " + key);
		}
	}
}


function parseBeats (str) {
	
	// Create empty beat array or arrays (for syllables)
	// YK beat_contents = new Array(beatsPerLine+1).fill([]);
	beat_contents = [];
	beat_contents.push([]);
	
	if (typeof str != 'undefined' && str != null) {
		// 1. Split by spaces into "words"
		var words = str.split(" ");
		var beat_num = 0;

		for (let w=0;w<words.length;w++) {
			// For each "word", split by beats
			beat_splits = words[w].split(beatMark);
			if (beat_splits.length == 1) {
				// No beat, add word to current beat
				if (debug) { console.log("No beat: " + beat_splits[0]); }
				if (beat_contents[beat_num].length == 0) { 
					beat_contents[beat_num] = [ beat_splits[0] ];
				} else {
					if (beat_splits[0] != "") {	// Check for empty string
						beat_contents[beat_num].push( beat_splits[0] );
					}
				}
				if (debug) { console.log(beat_contents); }
			}
			else { // Found a beat		
				// Deal with split before the beat
				this_beat = beat_splits[0];
				if (beat_contents[beat_num].length == 0) { // Pickup to beat is empty: [] 
					beat_contents[beat_num] = [ this_beat ];
				} else if (this_beat != "") {
					beat_contents[beat_num].push( this_beat );
				}

				if (this_beat != "") {
					beat_contents[beat_num].push( "-" ); // Not empty, so it's a partial word
				}
				if (debug) { console.log(beat_contents); }

				// Deal with stuff after the first beat marker
				for (let b=1;b<beat_splits.length;b++) {
					  beat_contents.push([]); // Create a new beat
						beat_num++;
						if (debug) { console.log("Beat increment: " + beat_num); }

					// Add syllable to current beat array
					this_beat = beat_splits[b];
					this_hyphen = this_beat.split("-");
					this_beat = [];
					this_beat[0] = this_hyphen[0];
					for (let h=1;h<this_hyphen.length;h++) {
						this_beat.push("-");
						this_beat.push(this_hyphen[h]);
					}

					if (beat_contents[beat_num].length == 0) { 
						beat_contents[beat_num] = this_beat; // this_beat is/may already an array?
					} else {
						if (beat_contents[beat_num] == "") {
							beat_contents[beat_num] = this_beat; // this_beat is/may already an array?
						} else if (this_beat != "") {
							beat_contents[beat_num] = beat_contents[beat_num].concat( this_beat );
						}
					}

					if (b < beat_splits.length - 1) {
						// If it's not empty, it's mid-word, so add a hyphen
						if (beat_splits[b] != "") {
							if (debug_beats) { console.log('b: '+b+', beat_splits: '+beat_splits); }
							beat_contents[beat_num].push( "-" );
						}
					}
					if (debug) { console.log(beat_contents); }
				}
			}
		}
	} // End check for undefined / empty input
	return beat_contents;
}
