# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `ai-powered-audiobook` (or your preferred name)
4. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Register Your App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register your app with a nickname: `AI AudioBook Web`
3. Click "Register app"
4. Copy the Firebase configuration object

## Step 3: Configure Your App

1. Open the file: `config/firebase.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

## Step 5: Test Your Setup

1. Start your app:
   ```bash
   npm start
   ```

2. Test the authentication flow:
   - Sign up with a new account
   - Log out
   - Log in with the same credentials

## Optional: Configure Firebase for Mobile

### For iOS:
1. In Firebase Console, add an iOS app
2. Download `GoogleService-Info.plist`
3. Add it to your iOS project

### For Android:
1. In Firebase Console, add an Android app
2. Download `google-services.json`
3. Add it to your Android project (`android/app/`)

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Check that your API key is correct in `config/firebase.ts`
- Ensure you've saved the file after making changes

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in Firebase Console
- Go to Authentication > Sign-in method and enable Email/Password

### Error: "Cannot connect to Firebase"
- Check your internet connection
- Verify your Firebase project is active
- Ensure the configuration values are correct

## Next Steps

Once authentication is working, you can:
- Add Firestore database for storing book data
- Add Firebase Storage for audiobook files
- Configure push notifications with Firebase Cloud Messaging
- Set up Firebase Analytics for tracking user behavior

## Security Rules (Important!)

Before deploying to production, make sure to configure proper security rules:

1. Go to **Firestore Database > Rules**
2. Set up proper read/write permissions
3. Never expose sensitive data without proper authentication checks

For development, you can use:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note:** This allows all authenticated users to read/write. Refine these rules for production!
