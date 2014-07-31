

function myFunction() {
    document.getElementById("demo").innerHTML = decompress(compress("xyz"));
}



//LZW Compression/Decompression for Strings
function compress(uncompressed) {
	"use strict";
	// Build the dictionary.
	var i,
		dictionary = {},
		c,
		wc,
		w = "",
		result = [],
		dictSize = 256;
	for (i = 0; i < 256; i += 1) {
		dictionary[String.fromCharCode(i)] = i;
	}

	for (i = 0; i < uncompressed.length; i += 1) {
		c = uncompressed.charAt(i);
		wc = w + c;
		//Do not use dictionary[wc] because javascript arrays 
		//will return values for array['pop'], array['push'] etc
	   // if (dictionary[wc]) {
		if (dictionary.hasOwnProperty(wc)) {
			w = wc;
		} else {
			result.push(dictionary[w]);
			// Add wc to the dictionary.
			dictionary[wc] = dictSize++;
			w = String(c);
		}
	}

	// Output the code for w.
	if (w !== "") {
		result.push(dictionary[w]);
	}
	return result;
}


function decompress(compressed) {
	"use strict";
	// Build the dictionary.
	var i,
		dictionary = [],
		w,
		result,
		k,
		entry = "",
		dictSize = 256;
	for (i = 0; i < 256; i += 1) {
		dictionary[i] = String.fromCharCode(i);
	}

	w = String.fromCharCode(compressed[0]);
	result = w;
	for (i = 1; i < compressed.length; i += 1) {
		k = compressed[i];
		if (dictionary[k]) {
			entry = dictionary[k];
		} else {
			if (k === dictSize) {
				entry = w + w.charAt(0);
			} else {
				return null;
			}
		}

		result += entry;

		// Add w+entry[0] to the dictionary.
		dictionary[dictSize++] = w + entry.charAt(0);

		w = entry;
	}
	return result;
}



function loadFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    if (f) {
      /*var reader = new FileReader();
      reader.onload = function(e) {
			var header = e.target.result;
			document.getElementById('demo').innerHTML = header + '<br>';
			if (header != "GIF89a") alert("not a valid GIF file");
		};
	  
		var blob = f.slice(0, 6);
		reader.readAsBinaryString(blob);*/
		
		var reader = new FileReader();
		reader.onload = function(e) {
			var buffer = e.target.result;
			var dv = new Int32Array(buffer);
			var p = 0;
			document.getElementById('demo').innerHTML = dv[p++].toString(32) + dv[p++].toString(32) + '<br>';
			var gr = new GifReader(buffer);
			
			alert(gr.frameInfo(0));
		};
		reader.readAsArrayBuffer(f);
			
    } else { 
      alert("Failed to load file");
    }
  };

function readFile() {
	var files = document.getElementById('files').files;
	if (!files.length) {
		alert('Please select a file!');
		return;
	}

	var file = files[0];
	var reader = new FileReader();
	reader.onload = function(e) {
		var buffer = e.target.result;
		var p = 0;
		document.getElementById('demo').innerHTML = buffer[p++].toString(32) + buffer[p++].toString(32) + '<br>';
		var gr = new GifReader(buffer);
		
		alert(gr.frameInfo(0));
	};
	reader.readAsArrayBuffer(file);
}

  
comp = compress("TOBEORNOTTOBEORTOBEORNOT");
decomp = decompress(comp);
document.write(comp + '<br>' + decomp);