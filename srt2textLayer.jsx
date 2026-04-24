// Create a new window
var myWindow = new Window("palette", "srt to text layers - FIXED");

// Create a label for the selected file
var selectedFileLabel = myWindow.add("statictext", undefined, "Select .srt File");

// Create a button that opens a file browser
var selectFileButton = myWindow.add("button", undefined, "Browse");

selectFileButton.onClick = function() {
    // Get the active composition
    var comp = app.project.activeItem;
    if (comp === null || !(comp instanceof CompItem)) {
        alert("No active composition found. Please open or create a composition first.");
        return;
    }
    
    var textYPos = comp.height - (comp.height * 0.25);
    var textXPos = comp.width / 2;
    
    // Open file dialog
    var srtFile = File.openDialog("Select .srt file", "*.srt");
    
    if (srtFile !== null && srtFile.exists) {
        // Read the entire file
        srtFile.open("r");
        srtFile.encoding = "UTF-8";
        
        var lines = [];
        while (!srtFile.eof) {
            lines.push(srtFile.readln());
        }
        srtFile.close();
        
        // Parse the SRT file
        var subtitles = [];
        var currentSub = {};
        var textLines = [];
        
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            
            // Skip empty lines at the beginning
            if (line === "" && Object.keys(currentSub).length === 0) {
                continue;
            }
            
            // Check if this line is a number (subtitle index)
            if (/^\d+$/.test(line.trim()) && !currentSub.start) {
                // This is the index line, ignore it
                continue;
            }
            // Check if this line contains timecodes (has "-->")
            else if (line.indexOf("-->") !== -1 && !currentSub.start) {
                var timeParts = line.split("-->");
                currentSub.start = timeToSeconds(timeParts[0].trim());
                currentSub.end = timeToSeconds(timeParts[1].trim());
            }
            // Check if this is an empty line (end of current subtitle)
            else if (line === "" && currentSub.start) {
                // Save the current subtitle
                if (textLines.length > 0) {
                    currentSub.text = textLines.join("\r");
                    subtitles.push(currentSub);
                }
                // Reset for next subtitle
                currentSub = {};
                textLines = [];
            }
            // Otherwise, it's a line of text for the current subtitle
            else if (currentSub.start) {
                textLines.push(line);
            }
        }
        
        // Don't forget the last subtitle if file doesn't end with empty line
        if (currentSub.start && textLines.length > 0) {
            currentSub.text = textLines.join("\r");
            subtitles.push(currentSub);
        }
        
        // Create text layers for each subtitle
        var layerCount = 0;
        for (var s = 0; s < subtitles.length; s++) {
            var sub = subtitles[s];
            if (sub.text && sub.text !== "") {
                var textLayer = comp.layers.addText(sub.text);
                textLayer.startTime = sub.start;
                textLayer.outPoint = sub.end;
                // Center justification
                try {
                    textLayer.property("Text").property("Justification").setValue(ParagraphJustification.CENTER_JUSTIFY);
                } catch(e) {
                    // If justification fails, try alternate method
                    textLayer.property("Source Text").setValue(sub.text);
                }
                // Set position
                textLayer.property("Transform").property("Position").setValue([textXPos, textYPos]);
                layerCount++;
            }
        }
        
        alert("Successfully imported " + layerCount + " subtitle layers.");
        myWindow.close();
    } else {
        alert("No file selected or file not found.");
    }
};

// Show the window
myWindow.show();

// Function to convert timecode string to seconds
function timeToSeconds(timecode) {
    // Handle format: HH:MM:SS,mmm or HH:MM:SS.mmm
    var parts = timecode.split(":");
    var hours = parseInt(parts[0]);
    var minutes = parseInt(parts[1]);
    
    // The seconds part may have comma or dot as decimal separator
    var secondsPart = parts[2].replace(",", ".");
    var seconds = parseFloat(secondsPart);
    
    return (hours * 3600) + (minutes * 60) + seconds;
}