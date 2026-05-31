import pyautogui
import time

print("=== Screen Coordinate Finder ===")
print("Move your mouse to the position you want to use")
print("Press Ctrl+C to stop")
print()

try:
    while True:
        x, y = pyautogui.position()
        print(f"Mouse position: ({x}, {y})", end='\r')
        time.sleep(0.1)
except KeyboardInterrupt:
    print("\n\nCoordinate finder stopped.")
    print("Use these coordinates in your instruction.json file!") 