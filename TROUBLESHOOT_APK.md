# Troubleshooting: Cannot Find "Build APK"

If you clicked **Build** in the menu but don't see **Build Bundle(s) / APK(s)**, you likely opened the wrong folder.

### ❌ Wrong Way
If you opened `school_app`, Android Studio doesn't know it's an Android app.

### ✅ Correct Way
1.  In Android Studio, go to **File** > **Close Project**.
2.  Click **Open**.
3.  Navigate inside `school_app` and select the **`android`** folder.
    *   Path: `.../school_app/android`
4.  Click **OK**.

### Wait for Sync
*   Look at the bottom right of the window.
*   If you see a progress bar saying "Gradle Build Running" or "Syncing", **WAIT**.
*   Once it finishes, the **Build** menu will show the correct options.
