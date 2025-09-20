# Gmail API Setup Guide

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select existing project
3. Name: "Financial Email Assistant"
4. Click "Create"

### 1.2 Enable Gmail API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click on "Gmail API" and click "Enable"

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" (unless you have G Suite)
3. Fill in required fields:
   - App name: "Financial Email Assistant"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `https://www.googleapis.com/auth/gmail.readonly`
5. Add test users: Your email address

### 1.4 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Application type: "Desktop application"
4. Name: "Financial Email Desktop App"
5. Download the JSON file
6. Rename it to `credentials.json`
7. Place it in `src/credentials/` folder

## Step 2: Install Google APIs

```bash
npm install googleapis google-auth-library
```

## Step 3: Credential File Structure

Your `credentials.json` should look like:

```json
{
  "installed": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "client_secret": "your-client-secret",
    "redirect_uris": ["http://localhost"]
  }
}
```

## Security Notes

- Never commit `credentials.json` to Git
- The `.gitignore` already excludes the `credentials/` folder
- Keep your client secret secure
- Use environment variables for production deployment

## Next Steps

Once you have the `credentials.json` file:

1. We'll create the Gmail authentication flow
2. Implement email fetching functions
3. Replace sample data with real emails
4. Add financial email filtering

## Troubleshooting

**If OAuth consent screen shows as "unverified":**

- This is normal for development
- Click "Advanced" then "Go to app (unsafe)" for testing
- For production, you'd need to verify the app with Google

**If you get quota errors:**

- Gmail API has daily limits (1 billion quota units/day)
- Each email fetch uses ~5-10 quota units
- More than enough for personal use
