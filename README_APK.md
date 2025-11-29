# How to Build the Android APK

This project has been configured with **Capacitor** to run as a native Android app.
Follow these steps to generate the APK file.

## Prerequisites

1.  **Download and Install Android Studio**:
    *   Go to [https://developer.android.com/studio](https://developer.android.com/studio) and download the latest version.
    *   Install it and ensure you install the **Android SDK** and **Android Virtual Device** components during setup.

## Building the APK

1.  **Open the Project in Android Studio**:
    *   Open Android Studio.
    *   Select **Open** (or "Open an existing Android Studio project").
    *   Navigate to this project's folder: `school_app/android`.
    *   Click **OK** to open it.
    *   Wait for Gradle to sync (this might take a few minutes the first time).

2.  **Build the APK**:
    *   In the top menu, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    *   Android Studio will compile the app. This may take a moment.

3.  **Locate the APK**:
    *   Once the build is complete, a notification will appear in the bottom right corner: "APK(s) generated successfully".
    *   Click **locate** in that notification.
    *   Alternatively, navigate to: `school_app/android/app/build/outputs/apk/debug/`.
    *   You will find `app-debug.apk`. This is your installable Android app!

## Updating the App

If you make changes to the React code (in `src`), you need to update the Android project:

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  Sync the changes to Android:
    ```bash
    npx cap sync
    ```
3.  Re-build the APK in Android Studio.
