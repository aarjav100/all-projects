# Personal AI Agent

A powerful desktop AI agent that understands **natural language instructions** and executes them automatically. Just write what you want in plain English!

## 🎯 Features

- ✅ **Natural Language Understanding** - Write instructions in plain English
- ✅ **Continuous listening** - Never stops running
- ✅ **Open websites** - Launch any URL in your default browser
- ✅ **Launch applications** - Open any installed application
- ✅ **Type text** - Automatically type text at cursor position
- ✅ **Move cursor** - Move mouse to specific coordinates
- ✅ **Click positions** - Click at specific screen coordinates
- ✅ **Type at position** - Move to location and type text
- ✅ **Easy to expand** - Simple structure for adding new actions
- ✅ **Cross-platform** - Works on Windows, macOS, and Linux

## 📁 Project Structure

```
personal_ai_agent/
│
├── agent.py                    ← Main agent script
├── prompt_processor.py         ← Natural language processor
├── write_prompt.py            ← Easy prompt writing tool
├── coordinate_finder.py        ← Find screen coordinates
├── instruction.json            ← Command file (AI writes to this)
├── requirements.txt            ← Python dependencies
├── natural_language_examples.json ← Natural language examples
├── typing_examples.json        ← Examples of typing actions
├── example_instructions.json   ← Basic examples
├── run_agent.bat              ← Windows launcher
├── run_agent.sh               ← Unix/Linux launcher
└── README.md                  ← This file
```

## 🚀 Quick Setup

### Step 1: Install Python
Make sure Python is installed on your system:

```bash
python --version
```

### Step 2: Install Dependencies
Install the required packages:

```bash
pip install -r requirements.txt
```

### Step 3: Run Your Agent
Open terminal in the `personal_ai_agent/` folder:

```bash
python agent.py
```

You'll see:
```
AI Agent started. Listening for instructions...
Press Ctrl+C to stop the agent

==================================================
NATURAL LANGUAGE INSTRUCTIONS SUPPORTED!
==================================================
I can understand natural language instructions like:

🖥️ Open applications:
- "Open Chrome"
- "Launch Notepad"
- "Start Calculator"

🌐 Open websites:
- "Open https://chat.openai.com"
- "Go to https://google.com"
- "Visit the website at https://github.com"

⌨️ Type text:
- "Type Hello World"
- "Write This is a test message"
- "Enter some text here"

🖱️ Mouse control:
- "Move cursor to position 500, 300"
- "Click at position 400, 200"
- "Type Hello at position 600, 400"

Just write your instruction in natural language and I'll execute it!
==================================================
```

The agent is now running and listening for instructions!

## 📝 How to Use - Natural Language Instructions

### Method 1: Write Prompts Directly to File
Edit `instruction.json` and add your natural language instruction:

```json
{
    "prompt": "Open https://chat.openai.com"
}
```

### Method 2: Use the Prompt Writer Tool (Easiest!)
```bash
python write_prompt.py "Open Chrome"
```

Or run interactively:
```bash
python write_prompt.py
```

### Method 3: Manual JSON (Backward Compatible)
You can still use the old JSON format if needed:

```json
{
    "action": "open_browser",
    "url": "https://chat.openai.com"
}
```

## 🎯 Natural Language Examples

### 🌐 Open Websites
```json
{"prompt": "Open https://chat.openai.com"}
{"prompt": "Go to https://google.com"}
{"prompt": "Visit the website at https://github.com"}
```

### 🖥️ Open Applications
```json
{"prompt": "Open Chrome"}
{"prompt": "Launch Notepad"}
{"prompt": "Start Calculator"}
{"prompt": "Open Word"}
{"prompt": "Launch Excel"}
```

### ⌨️ Type Text
```json
{"prompt": "Type Hello World"}
{"prompt": "Write This is a test message"}
{"prompt": "Enter some text here"}
```

### 🖱️ Mouse Control
```json
{"prompt": "Move cursor to position 500, 300"}
{"prompt": "Click at position 400, 200"}
{"prompt": "Type Hello at position 600, 400"}
```

## 🛠️ Tools Included

### Coordinate Finder
Find screen coordinates for precise positioning:
```bash
python coordinate_finder.py
```

### Prompt Writer
Easy way to write instructions:
```bash
python write_prompt.py "Your instruction here"
```

## 🔧 Supported Actions

The agent understands these natural language patterns:

### `open_browser`
- "Open [URL]"
- "Go to [URL]"
- "Visit [URL]"
- "Navigate to [URL]"

### `open_application`
- "Open [app name]"
- "Launch [app name]"
- "Start [app name]"
- "Run [app name]"

### `type_text`
- "Type [text]"
- "Write [text]"
- "Enter [text]"
- "Input [text]"

### `move_cursor`
- "Move cursor to position [x], [y]"
- "Move mouse to [x], [y]"
- "Position cursor at [x], [y]"

### `click_position`
- "Click at position [x], [y]"
- "Click [x], [y]"
- "Click on position [x], [y]"

### `type_at_position`
- "Type [text] at position [x], [y]"
- "Write [text] at position [x], [y]"

## 🎯 Finding Screen Coordinates

To find the coordinates where you want to type or click:

### Method 1: Use the Coordinate Finder
```bash
python coordinate_finder.py
```

### Method 2: Use Python to get current mouse position
```python
import pyautogui
print(pyautogui.position())  # Shows (x, y) coordinates
```

### Method 3: Use Windows Mouse Position Tool
- Press `Win + R`
- Type `osk` and press Enter (opens on-screen keyboard)
- Move your mouse to the desired position
- Note the coordinates from the tool

## 🛠️ Troubleshooting

### Common Issues

**"File not found" error:**
- Make sure you're running `agent.py` from the `personal_ai_agent/` directory
- Ensure `instruction.json` exists in the same folder

**Application won't open:**
- Verify the application path is correct
- Use double backslashes `\\` in Windows paths
- Check if the application is installed

**Permission errors:**
- Run the script with appropriate permissions
- Some applications may require admin rights

**PyAutoGUI not working:**
- Make sure you installed dependencies: `pip install -r requirements.txt`
- On some systems, you may need to run as administrator

**Mouse moves to wrong position:**
- Check your screen resolution
- Coordinates are relative to your screen size
- Test with small movements first

**Prompt not understood:**
- Check the examples in `natural_language_examples.json`
- Use the help text shown when the agent starts
- Try different phrasings for the same action

## 🚀 Future Enhancements

This enhanced agent now includes natural language understanding. You can easily add:

- **More complex instructions** - Multi-step workflows
- **Conditional actions** - "If this, then that"
- **Scheduled tasks** - "Do this at 3 PM"
- **Keyboard shortcuts** - `pyautogui.hotkey()`
- **Drag and drop** - `pyautogui.drag()`
- **Screenshot capture** - `pyautogui.screenshot()`
- **Download files** - `requests` library
- **Play audio** - `pygame` or `playsound`
- **Read emails** - Email API integration
- **Control other devices** - Network communication

## 💡 Pro Tips

1. **Keep it running** - The agent works best when left running continuously
2. **Use natural language** - Write instructions as you would speak them
3. **Test with simple actions** - Start with opening websites before complex tasks
4. **Monitor the console** - Watch for error messages and execution confirmations
5. **Use failsafe** - Move mouse to screen corner to stop PyAutoGUI if needed
6. **Test coordinates** - Always test mouse positions on your specific screen setup
7. **Use the prompt writer** - `python write_prompt.py` makes it easy to send instructions

## 🔗 Integration Ideas

- **Bolt AI** - Have Bolt write natural language prompts to `instruction.json`
- **Auto-GPT** - Use as a tool for desktop automation
- **CrewAI** - Integrate as a worker agent
- **Custom scripts** - Write your own instruction generators
- **Web automation** - Automate form filling and website interactions
- **Voice assistants** - Connect to voice recognition for hands-free control

## ⚠️ Safety Features

- **Failsafe enabled** - Move mouse to screen corner to stop PyAutoGUI
- **Built-in delays** - Prevents too-rapid actions
- **Error handling** - Graceful error recovery
- **Position validation** - Checks coordinates before moving
- **Natural language validation** - Confirms understanding before execution

---

**Your intelligent personal AI agent is ready!** 🎉

This agent now understands natural language - just write what you want in plain English and watch it happen! 