import re
import json

class PromptProcessor:
    def __init__(self):
        self.action_patterns = {
            'open_browser': [
                r'open\s+(?:the\s+)?(?:website|site|page|url)\s+(?:at\s+)?(https?://\S+)',
                r'go\s+to\s+(?:the\s+)?(?:website|site|page|url)\s+(?:at\s+)?(https?://\S+)',
                r'navigate\s+to\s+(?:the\s+)?(?:website|site|page|url)\s+(?:at\s+)?(https?://\S+)',
                r'visit\s+(?:the\s+)?(?:website|site|page|url)\s+(?:at\s+)?(https?://\S+)',
                r'open\s+(https?://\S+)',
                r'go\s+to\s+(https?://\S+)'
            ],
            'open_application': [
                r'open\s+(?:the\s+)?(?:app|application|program)\s+(.+)',
                r'launch\s+(?:the\s+)?(?:app|application|program)\s+(.+)',
                r'start\s+(?:the\s+)?(?:app|application|program)\s+(.+)',
                r'run\s+(?:the\s+)?(?:app|application|program)\s+(.+)'
            ],
            'type_text': [
                r'type\s+(?:the\s+)?(?:text|message|content)\s+(.+)',
                r'write\s+(?:the\s+)?(?:text|message|content)\s+(.+)',
                r'enter\s+(?:the\s+)?(?:text|message|content)\s+(.+)',
                r'input\s+(?:the\s+)?(?:text|message|content)\s+(.+)'
            ],
            'type_at_position': [
                r'type\s+(.+)?\s+at\s+position\s+\(?(\d+)\s*,\s*(\d+)\)?',
                r'write\s+(.+)?\s+at\s+position\s+\(?(\d+)\s*,\s*(\d+)\)?',
                r'enter\s+(.+)?\s+at\s+position\s+\(?(\d+)\s*,\s*(\d+)\)?',
                r'input\s+(.+)?\s+at\s+position\s+\(?(\d+)\s*,\s*(\d+)\)?'
            ],
            'move_cursor': [
                r'move\s+(?:the\s+)?(?:cursor|mouse)\s+to\s+position\s+\(?(\d+)\s*,\s*(\d+)\)?',
                r'move\s+(?:the\s+)?(?:cursor|mouse)\s+to\s+\(?(\d+)\s*,\s*(\d+)\)?',
                r'position\s+(?:the\s+)?(?:cursor|mouse)\s+at\s+\(?(\d+)\s*,\s*(\d+)\)?'
            ],
            'click_position': [
                r'click\s+at\s+position\s+\(?(\d+)\s*,\s*(\d+)\)?',
                r'click\s+\(?(\d+)\s*,\s*(\d+)\)?',
                r'click\s+on\s+position\s+\(?(\d+)\s*,\s*(\d+)\)?'
            ]
        }
        
        # Common application mappings
        self.app_mappings = {
            'chrome': r'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'firefox': r'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
            'edge': r'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            'notepad': r'C:\\Windows\\System32\\notepad.exe',
            'calculator': r'C:\\Windows\\System32\\calc.exe',
            'word': r'C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE',
            'excel': r'C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE',
            'powerpoint': r'C:\\Program Files\\Microsoft Office\\root\\Office16\\POWERPNT.EXE'
        }

    def process_prompt(self, prompt):
        """Convert natural language prompt to JSON instruction"""
        prompt = prompt.lower().strip()
        
        # Check each action pattern
        for action, patterns in self.action_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, prompt, re.IGNORECASE)
                if match:
                    return self._create_instruction(action, match, prompt)
        
        # If no specific pattern matches, try to infer the action
        return self._infer_action(prompt)

    def _create_instruction(self, action, match, original_prompt):
        """Create JSON instruction based on matched action"""
        instruction = {"action": action}
        
        if action == "open_browser":
            instruction["url"] = match.group(1)
            
        elif action == "open_application":
            app_name = match.group(1).strip()
            # Try to map common app names to paths
            for name, path in self.app_mappings.items():
                if name in app_name.lower():
                    instruction["path"] = path
                    break
            if "path" not in instruction:
                instruction["path"] = app_name  # Use as-is if no mapping found
                
        elif action == "type_text":
            instruction["text"] = match.group(1).strip()
            
        elif action == "type_at_position":
            if len(match.groups()) == 3:
                instruction["text"] = match.group(1).strip()
                instruction["x"] = int(match.group(2))
                instruction["y"] = int(match.group(3))
            else:
                # Handle case where text might be in the prompt
                instruction["text"] = "Text to type"
                instruction["x"] = int(match.group(1))
                instruction["y"] = int(match.group(2))
                
        elif action == "move_cursor":
            instruction["x"] = int(match.group(1))
            instruction["y"] = int(match.group(2))
            
        elif action == "click_position":
            instruction["x"] = int(match.group(1))
            instruction["y"] = int(match.group(2))
        
        return instruction

    def _infer_action(self, prompt):
        """Infer action from general prompt content"""
        if any(word in prompt for word in ['website', 'url', 'http', 'www']):
            # Try to extract URL
            url_match = re.search(r'(https?://\S+)', prompt)
            if url_match:
                return {"action": "open_browser", "url": url_match.group(1)}
        
        if any(word in prompt for word in ['type', 'write', 'enter', 'input']):
            # Try to extract text to type
            text_match = re.search(r'["\']([^"\']+)["\']', prompt)
            if text_match:
                return {"action": "type_text", "text": text_match.group(1)}
        
        # Default: return empty instruction
        return {}

    def get_help_text(self):
        """Return help text with examples"""
        return """
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
        """ 