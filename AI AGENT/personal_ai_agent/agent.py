import json
import time
import webbrowser
import subprocess
import os
import pyautogui
from prompt_processor import PromptProcessor

# Configure pyautogui for safety
pyautogui.FAILSAFE = True  # Move mouse to corner to stop
pyautogui.PAUSE = 0.1  # Small delay between actions

# Initialize prompt processor
prompt_processor = PromptProcessor()

def open_website(url):
    print(f"Opening website: {url}")
    webbrowser.open(url)

def open_application(path):
    print(f"Opening application: {path}")
    if os.name == 'nt':  # Windows
        subprocess.Popen(path)
    elif os.name == 'posix':  # macOS/Linux
        subprocess.Popen(["open", path])

def type_text(text, delay=0.05):
    """Type text with optional delay between characters"""
    print(f"Typing text: {text[:50]}{'...' if len(text) > 50 else ''}")
    pyautogui.typewrite(text, interval=delay)

def move_to_position(x, y):
    """Move cursor to specific coordinates"""
    print(f"Moving cursor to position: ({x}, {y})")
    pyautogui.moveTo(x, y)

def click_position(x, y):
    """Click at specific coordinates"""
    print(f"Clicking at position: ({x}, {y})")
    pyautogui.click(x, y)

def type_at_position(text, x, y, delay=0.05):
    """Move to position and type text"""
    print(f"Moving to ({x}, {y}) and typing: {text[:50]}{'...' if len(text) > 50 else ''}")
    pyautogui.moveTo(x, y)
    pyautogui.click()  # Click to focus
    time.sleep(0.2)  # Small delay to ensure focus
    pyautogui.typewrite(text, interval=delay)

def process_natural_language_prompt(prompt):
    """Process natural language prompt and convert to instruction"""
    print(f"Processing prompt: {prompt}")
    instruction = prompt_processor.process_prompt(prompt)
    
    if instruction:
        print(f"Converted to action: {instruction['action']}")
        return instruction
    else:
        print("Could not understand the prompt. Here are some examples:")
        print(prompt_processor.get_help_text())
        return {}

def agent_loop():
    print("AI Agent started. Listening for instructions...")
    print("Press Ctrl+C to stop the agent")
    print("\n" + "="*50)
    print("NATURAL LANGUAGE INSTRUCTIONS SUPPORTED!")
    print("="*50)
    print(prompt_processor.get_help_text())
    print("="*50)

    while True:
        try:
            with open("instruction.json", "r") as file:
                content = json.load(file)

            if content:
                # Check if it's a natural language prompt or structured instruction
                if "prompt" in content:
                    # Natural language prompt
                    prompt = content["prompt"]
                    instruction = process_natural_language_prompt(prompt)
                else:
                    # Structured instruction (backward compatibility)
                    instruction = content

                if instruction:
                    action = instruction.get("action")
                    
                    if action == "open_browser":
                        url = instruction.get("url")
                        if url:
                            open_website(url)

                    elif action == "open_application":
                        path = instruction.get("path")
                        if path:
                            open_application(path)

                    elif action == "type_text":
                        text = instruction.get("text")
                        if text:
                            type_text(text)

                    elif action == "move_cursor":
                        x = instruction.get("x")
                        y = instruction.get("y")
                        if x is not None and y is not None:
                            move_to_position(x, y)

                    elif action == "click_position":
                        x = instruction.get("x")
                        y = instruction.get("y")
                        if x is not None and y is not None:
                            click_position(x, y)

                    elif action == "type_at_position":
                        text = instruction.get("text")
                        x = instruction.get("x")
                        y = instruction.get("y")
                        if text and x is not None and y is not None:
                            type_at_position(text, x, y)

                # Reset file after execution
                with open("instruction.json", "w") as reset_file:
                    reset_file.write("{}")

        except Exception as e:
            print(f"Error: {e}")

        time.sleep(3)  # check every 3 seconds

if __name__ == "__main__":
    agent_loop()