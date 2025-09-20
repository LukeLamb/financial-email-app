# Manual Gmail Authentication

Since the OAuth redirect isn't working smoothly, let's authenticate manually:

## Step 1: Get the Authorization Code

From your console output, you already have authorization codes. The most recent one is:
```
4/0AVGzR1ASqb3X6iZw1JxYlpQfjaYHTuneoTzSRrtj3dsGirxywmF4EzodlYL-6I-1bVjyZA
```

## Step 2: Create Token Manually

Let's create a simple script to exchange this code for a token.

1. Copy the authorization code (without the %2F encoding)
2. Run the token exchange
3. Save the token file

## Quick Test

You can also test this in the Node.js console:

```javascript
const { google } = require('googleapis');
const fs = require('fs').promises;

// Your credentials
const credentials = require('./src/credentials/credentials.json');
const { client_secret, client_id, redirect_uris } = credentials.installed;

// Create OAuth client
const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Exchange code for token
const code = '4/0AVGzR1ASqb3X6iZw1JxYlpQfjaYHTuneoTzSRrtj3dsGirxywmF4EzodlYL-6I-1bVjyZA';

auth.getToken(code).then(({ tokens }) => {
    console.log('Tokens received:', tokens);
    fs.writeFile('./src/credentials/token.json', JSON.stringify(tokens));
    console.log('Token saved!');
}).catch(console.error);
```

This will create the token.json file your app needs.
