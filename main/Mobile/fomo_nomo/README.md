## 🚀 Flutter Local Setup & GitHub Project Workflow

## 🧩 Pre-requisites
### macOS, Windows, or Linux computer
### Git installed and configured (git --version)
### GitHub account (logged in on web or CLI for project)
### Code Editor (VS Code recommended)

## 🛠 Step 1 – Install Flutter SDK (Manual Install is Fastest)
### 1.) Go to 👉 Flutter Quick Start Guide (https://docs.flutter.dev/get-started/quick)
### 2.) Choose your OS and download the Flutter SDK ZIP.
### 3.) Extract it anywhere you keep development tools: For example: ~/dev/flutter
### 4.) Open your .zshrc or .bashrc (using vim, VS Code, etc.) and add Flutter to your PATH:
Point it to the folder where you saved the SDK or new projects will live.
### 5.) Verify installation: Open terminal: flutter --version

## 🧱 Step 2 – Install Android Studio and Android SDK
### 1.) Go to 👉 Android Studio Download Page (1st link: https://developer.android.com/studio)
### 2.) Scroll to the bottom and download the version for your system.
### 3.) After installing, open Android Studio → Tools › SDK Manager.

### 4.) Under SDK Tools, confirm these are checked ✅:
Android SDK Command-line Tools (latest),
Android SDK Platform-Tools,
Android SDK Build-Tools.

### 5.) Make sure the SDK is set correctly:
If you don't know where it was placed. (Tools › SDK Manager will also show you)
In terminal do: which flutter (more detailed path)

### 6.) Accept SDK licenses in a terminal:

sdkmanager --licenses,
flutter doctor --android-licenses

## 🍎 For Mac Users (Extra Steps):
### 1.) Install Xcode from the App Store.

### 2.) In Terminal:
Install command-line tools → xcode-select --install

### 3.) Accept licenses →
sudo xcodebuild -license accept,
sudo xcodebuild -runFirstLaunch

### 4.) Install CocoaPods (needed for iOS dependencies).
Install Homebrew (Optional, but faster),
Then run: brew install cocoapods,
Check: pod --version

## 💻 Step 3 – Set Up VS Code with Flutter

### 1.) Open VS Code → Extensions panel.
### 2.) Search and install:
Flutter + Dart extension

## 🔍 Step 4 – Verify Everything Works

### 1.) Open a terminal and run -> flutter doctor

## If all sections should show green ✅ checks for Flutter, Android toolchain, and (iOS if on Mac). You are all SET!

## 🧩 Step 5 – Create and Run a Flutter Project

## Option A – Through VS Code
### 1.) Press Cmd + Shift + P (mac) or Ctrl + Shift + P (Windows).
### 2.) Type Flutter: New Project.
### 3.) Choose Application → name your project → select folder for storage.

## Option B – Through Terminal
### 1.) flutter create project_name
### 2.) cd project_name
### 3.) run flutter
Optional: type Code . (an extension that opens project to specified IDE)

## 🌐 Step 6 – Run on a Simulator or Emulator (be on the main.dart file)
### 2.) Open Command Palette again → Flutter: Select Device.
### 3.) Run the project → Flutter: Run Application or flutter run.

## Everything should work and simulator will pop up based on your device. Where you can then start development.
