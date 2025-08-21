# Summarize Project

A fast CLI tool to summarize your codebase or project into Markdown.  
Useful when you want to quickly generate a structured overview for documentation, onboarding, or sharing context with others (including AI assistants).

---

## Download

Prebuilt binaries are available for Linux, macOS, and Windows.  
Download the file for your system from the Releases section:

- Linux → summarize-project-linux
- macOS → summarize-project-macos
- Windows → summarize-project-win.exe

---

## Installation (system-wide)

### Linux / macOS
```bash
chmod +x summarize-project-linux
sudo mv summarize-project-linux /usr/local/bin/summarize-project
```

Now you can run it anywhere with:
```bash
summarize-project .
```
Windows

- Download summarize-project-win.exe
    
- Rename it to summarize-project.exe (optional)
    
- Move it somewhere in your PATH (e.g., C:\Windows\System32 or add a custom folder to PATH)
    
Run from cmd or PowerShell:

```bash
summarize-project .
```

Usage

Summarize a project directory:
```bash

summarize-project /path/to/project
```

This will generate a file named __summary.md containing a structured overview of the project.
Why use it?

- Share codebase context with AI tools without manual splitting
- Automatically adjusts to the input size limits of different assistants
- Skips binaries, media, and dependency folders
- Generate lightweight docs for onboarding or reviews

Save time when working with large projects

Example :
```bash
summarize-project .
```

Output:
```bash
✓ Output: __summary.md
```

Notes
- Binary files, media, and common dependencies (e.g. node_modules, venv, dist) are ignored automatically.
- Ignored patterns can be customized in the configuration file.
