import json
import sys

def write_prompt_to_file(prompt):
    """Write a natural language prompt to instruction.json"""
    instruction = {
        "prompt": prompt
    }
    
    try:
        with open("instruction.json", "w") as file:
            json.dump(instruction, file, indent=4)
        print(f"✅ Prompt written to instruction.json: '{prompt}'")
        print("The agent will process this instruction within 3 seconds!")
    except Exception as e:
        print(f"❌ Error writing prompt: {e}")

def main():
    if len(sys.argv) > 1:
        # Get prompt from command line arguments
        prompt = " ".join(sys.argv[1:])
        write_prompt_to_file(prompt)
    else:
        # Interactive mode
        print("=== AI Agent Prompt Writer ===")
        print("Enter your natural language instruction:")
        print("Examples:")
        print("- Open https://chat.openai.com")
        print("- Type Hello World")
        print("- Open Chrome")
        print("- Move cursor to position 500, 300")
        print()
        
        prompt = input("Your instruction: ").strip()
        if prompt:
            write_prompt_to_file(prompt)
        else:
            print("No prompt entered.")

if __name__ == "__main__":
    main() 