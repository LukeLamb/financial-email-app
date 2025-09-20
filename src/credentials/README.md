# Credentials Folder

## Important Security Notes

This folder will contain your Google API credentials:

- `credentials.json` - OAuth 2.0 client credentials from Google Cloud Console
- `token.json` - Automatically generated access token (created after first auth)

## ⚠️ Security Warning

**NEVER commit these files to Git!**

The `.gitignore` file already excludes this entire folder, but be extra careful:

1. Never share `credentials.json`
2. Never commit `token.json`
3. Keep these files secure and backed up separately

## Setup Steps

1. Follow the `GMAIL_SETUP_GUIDE.md` to create your Google Cloud project
2. Download the OAuth 2.0 credentials JSON file
3. Rename it to `credentials.json`
4. Place it in this folder
5. The app will automatically create `token.json` after first authentication

## File Structure

```bash
src/credentials/
├── credentials.json    # Your OAuth client credentials (you create this)
├── token.json         # Access token (automatically created)
└── README.md          # This file
```

Once you have `credentials.json` in place, the Gmail integration will work!
