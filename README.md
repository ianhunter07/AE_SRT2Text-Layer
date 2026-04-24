# Introduction
This code is made using [ExtendScript](https://extendscript.docsforadobe.dev/introduction/extendscript-overview.html) language with the help of [ChatGPT](https://openai.com/blog/chatgpt) to create text layers from existing ```.srt``` subtitle file in [Adobe After Effects](https://www.adobe.com/mena_en/products/aftereffects.html)

# How It Works?
The script creates a floating window with a "Select File" button that allows the user to browse for an ```.srt``` subtitle file. Once the user selects the file, the script reads the file and adds a text layer for each subtitle line to the active composition in After Effects.
To use the script within After Effects place ```srt2textLayer.jsx``` script file into ```C:\Program Files\Adobe\Adobe After Effects 2020\Support Files\Scripts``` path and the script should be available in After Effects

![demo](imgs/demo.gif)

# Openai Chat
Here is the chat and the process of making the script

![chat](imgs/chat.openai.com.png)

## ⚡ Version 2.0 - AE 2026 Compatibility Fix

**This fork includes a critical fix for After Effects 2026.**

### What was fixed?
- The original script works perfectly up to AE 2025.
- On AE 2026, the file browser button stopped working due to changes in Adobe's scripting API.
- **This version restores full functionality on AE 2026** and improves SRT parsing.

### Credits
- **Original script**: moziada
- **AE 2026 fix**: Community contribution

### How to use
Same as the original. Place `srt2textLayer.jsx` in your AE Scripts folder.
