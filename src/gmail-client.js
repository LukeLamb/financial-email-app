const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class GmailClient {
    constructor() {
        this.auth = null;
        this.gmail = null;
        this.credentialsPath = path.join(__dirname, 'credentials/credentials.json');
        this.tokenPath = path.join(__dirname, 'credentials/token.json');
    }

    async initialize() {
        try {
            // Load client secrets from credentials file
            const credentials = JSON.parse(await fs.readFile(this.credentialsPath));
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            
            // Create OAuth2 client
            this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            
            // Check if we have a saved token
            try {
                const token = JSON.parse(await fs.readFile(this.tokenPath));
                this.auth.setCredentials(token);
                
                // Create Gmail API instance
                this.gmail = google.gmail({ version: 'v1', auth: this.auth });
                
                console.log('✅ Gmail API authenticated with saved token');
                return true;
            } catch (err) {
                // No saved token, need to authenticate
                console.log('ℹ️ No saved token found, authentication required');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Gmail API initialization failed:', error.message);
            throw new Error(`Gmail initialization failed: ${error.message}`);
        }
    }

    async getAccessToken() {
        const authUrl = this.auth.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly'],
        });

        console.log('🔐 Authorize this app by visiting this URL:');
        console.log(authUrl);
        
        // Return the URL so the React app can handle it
        return authUrl;
    }

    async setAuthCode(code) {
        try {
            const { tokens } = await this.auth.getToken(code);
            this.auth.setCredentials(tokens);
            
            // Save the token for future use
            await fs.writeFile(this.tokenPath, JSON.stringify(tokens));
            console.log('✅ Token saved to', this.tokenPath);
            
            // Create Gmail API instance
            this.gmail = google.gmail({ version: 'v1', auth: this.auth });
            
            return true;
        } catch (error) {
            console.error('❌ Error retrieving access token:', error);
            return false;
        }
    }

    async getFinancialEmails(maxResults = 10) {
        if (!this.gmail) {
            throw new Error('Gmail API not initialized');
        }

        try {
            // Search for financial emails
            const query = 'from:(bolero.be OR kbc.be OR ing.be OR belfius.be) OR subject:(beurs OR markt OR portfolio OR investering)';
            
            const response = await this.gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: maxResults,
            });

            const messages = response.data.messages || [];
            
            // Get detailed message data
            const emails = await Promise.all(
                messages.map(async (message) => {
                    const emailData = await this.gmail.users.messages.get({
                        userId: 'me',
                        id: message.id,
                        format: 'full',
                    });

                    return this.parseEmailData(emailData.data);
                })
            );

            console.log(`✅ Retrieved ${emails.length} financial emails`);
            return emails;

        } catch (error) {
            console.error('❌ Error fetching emails:', error);
            throw error;
        }
    }

    parseEmailData(emailData) {
        const headers = emailData.payload.headers;
        
        // Extract header information
        const getHeader = (name) => {
            const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
            return header ? header.value : '';
        };

        // Extract email body
        let body = '';
        if (emailData.payload.body.data) {
            body = Buffer.from(emailData.payload.body.data, 'base64').toString();
        } else if (emailData.payload.parts) {
            // Handle multipart emails
            for (const part of emailData.payload.parts) {
                if (part.mimeType === 'text/plain' && part.body.data) {
                    body = Buffer.from(part.body.data, 'base64').toString();
                    break;
                }
            }
        }

        // Clean up the body text
        body = body.replace(/\r\n/g, '\n').trim();
        const preview = body.substring(0, 200) + (body.length > 200 ? '...' : '');

        return {
            id: emailData.id,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            date: new Date(parseInt(emailData.internalDate)).toISOString().split('T')[0],
            preview: preview,
            body: body,
            isFinancial: true,
            labels: emailData.labelIds || [],
            threadId: emailData.threadId
        };
    }

    async searchEmails(query, maxResults = 20) {
        if (!this.gmail) {
            throw new Error('Gmail API not initialized');
        }

        try {
            const response = await this.gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults: maxResults,
            });

            const messages = response.data.messages || [];
            
            const emails = await Promise.all(
                messages.map(async (message) => {
                    const emailData = await this.gmail.users.messages.get({
                        userId: 'me',
                        id: message.id,
                        format: 'full',
                    });

                    return this.parseEmailData(emailData.data);
                })
            );

            return emails;

        } catch (error) {
            console.error('❌ Error searching emails:', error);
            throw error;
        }
    }

    // Get user's email address for display
    async getUserProfile() {
        if (!this.gmail) {
            throw new Error('Gmail API not initialized');
        }

        try {
            const response = await this.gmail.users.getProfile({
                userId: 'me'
            });

            return {
                emailAddress: response.data.emailAddress,
                messagesTotal: response.data.messagesTotal,
                threadsTotal: response.data.threadsTotal
            };
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            throw error;
        }
    }
}

module.exports = GmailClient;
