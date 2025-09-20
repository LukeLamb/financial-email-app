import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// Main App Component with Gmail Integration
function FinancialEmailApp() {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authUrl, setAuthUrl] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState('');

    // Initialize Gmail API on component mount
    useEffect(() => {
        initializeGmail();
    }, []);

    const initializeGmail = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const result = await window.gmailAPI.initialize();
            
            if (result.success) {
                // Successfully authenticated with existing token
                setIsAuthenticated(true);
                await loadUserProfile();
                await loadFinancialEmails();
            } else {
                // Need to authenticate - get auth URL
                console.log('Need to authenticate, getting auth URL...');
                const authResult = await window.gmailAPI.getAuthUrl();
                if (authResult.success) {
                    setAuthUrl(authResult.authUrl);
                    console.log('Auth URL generated:', authResult.authUrl);
                } else {
                    setError('Failed to initialize Gmail API: ' + (authResult.error || 'Unknown error'));
                }
            }
        } catch (err) {
            console.error('Error in initializeGmail:', err);
            setError('Error initializing Gmail: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthentication = async () => {
        if (!authCode.trim()) {
            setError('Please enter the authorization code');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const result = await window.gmailAPI.setAuthCode(authCode.trim());
            
            if (result.success) {
                setIsAuthenticated(true);
                setAuthUrl('');
                setAuthCode('');
                await loadUserProfile();
                await loadFinancialEmails();
            } else {
                setError('Authentication failed: ' + result.error);
            }
        } catch (err) {
            setError('Authentication error: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUserProfile = async () => {
        try {
            const result = await window.gmailAPI.getUserProfile();
            if (result.success) {
                setUserProfile(result.profile);
            }
        } catch (err) {
            console.error('Error loading user profile:', err);
        }
    };

    const loadFinancialEmails = async () => {
        try {
            setIsLoading(true);
            setError('');

            const result = await window.gmailAPI.getFinancialEmails(20);
            
            if (result.success) {
                setEmails(result.emails);
                console.log(`✅ Loaded ${result.emails.length} financial emails`);
            } else {
                setError('Failed to load emails: ' + result.error);
            }
        } catch (err) {
            setError('Error loading emails: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSelect = (email) => {
        setSelectedEmail(email);
    };

    const handleProcessEmail = async () => {
        if (!selectedEmail) return;
        
        setIsProcessing(true);
        
        // Simulate AI processing for now (we'll connect Ollama in next step)
        setTimeout(() => {
            setIsProcessing(false);
            alert(`Processing email: ${selectedEmail.subject}\n\nNext step: Connect to Ollama for real Dutch translation!`);
        }, 2000);
    };

    const handleRefreshEmails = () => {
        loadFinancialEmails();
    };

    const openAuthUrl = () => {
        if (authUrl) {
            // Open auth URL in default browser
            window.open(authUrl, '_blank');
        }
    };

    // Authentication Screen
    if (!isAuthenticated) {
        return (
            <div className="app">
                <header className="app-header">
                    <h1>🇧🇪 Financial Email Assistant</h1>
                    <p>Gmail Authentication Required</p>
                </header>

                <div className="auth-container">
                    {isLoading ? (
                        <div className="loading">
                            <h2>🔄 Initializing Gmail API...</h2>
                            <p>Please wait while we set up your connection.</p>
                        </div>
                    ) : authUrl ? (
                        <div className="auth-flow">
                            <h2>🔐 Authorize Gmail Access</h2>
                            <p>To access your financial emails, please authorize this app:</p>
                            
                            <button className="auth-btn" onClick={openAuthUrl}>
                                🌐 Open Authorization Page
                            </button>
                            
                            <div className="auth-instructions">
                                <p><strong>Instructions:</strong></p>
                                <ol>
                                    <li>Click the button above to open Google's authorization page</li>
                                    <li>Sign in to your Google account</li>
                                    <li>Grant permission to read your Gmail</li>
                                    <li>Copy the authorization code</li>
                                    <li>Paste it below and click "Complete Authentication"</li>
                                </ol>
                            </div>

                            <div className="auth-code-input">
                                <input
                                    type="text"
                                    placeholder="Paste authorization code here..."
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value)}
                                    className="auth-input"
                                />
                                <button 
                                    className="complete-auth-btn"
                                    onClick={handleAuthentication}
                                    disabled={!authCode.trim()}
                                >
                                    ✅ Complete Authentication
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-error">
                            <h2>❌ Authentication Setup Failed</h2>
                            <p>Please check your credentials.json file and try again.</p>
                            <button className="retry-btn" onClick={initializeGmail}>
                                🔄 Retry Setup
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <h3>⚠️ Error:</h3>
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Main App Screen (after authentication)
    return (
        <div className="app">
            <header className="app-header">
                <h1>🇧🇪 Financial Email Assistant</h1>
                <p>Real Gmail Integration Active</p>
                {userProfile && (
                    <div className="user-info">
                        📧 {userProfile.emailAddress} • {userProfile.messagesTotal} total messages
                    </div>
                )}
            </header>

            <div className="app-content">
                <div className="email-list">
                    <div className="email-list-header">
                        <h2>📧 Financial Emails</h2>
                        <button 
                            className="refresh-btn" 
                            onClick={handleRefreshEmails}
                            disabled={isLoading}
                        >
                            {isLoading ? '🔄' : '↻'} Refresh
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="loading-emails">
                            <p>🔄 Loading your financial emails...</p>
                        </div>
                    ) : emails.length === 0 ? (
                        <div className="no-emails">
                            <p>📭 No financial emails found</p>
                            <p>Try refreshing or check your email filters</p>
                        </div>
                    ) : (
                        emails.map(email => (
                            <div 
                                key={email.id}
                                className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                                onClick={() => handleEmailSelect(email)}
                            >
                                <div className="email-subject">{email.subject}</div>
                                <div className="email-from">{email.from}</div>
                                <div className="email-preview">{email.preview}</div>
                                <div className="email-date">{email.date}</div>
                            </div>
                        ))
                    )}
                </div>

                <div className="email-details">
                    {selectedEmail ? (
                        <div>
                            <h2>📋 Email Details</h2>
                            <div className="selected-email">
                                <h3>{selectedEmail.subject}</h3>
                                <p><strong>From:</strong> {selectedEmail.from}</p>
                                <p><strong>Date:</strong> {selectedEmail.date}</p>
                                <div className="email-content">
                                    <p><strong>Preview:</strong></p>
                                    <p>{selectedEmail.preview}</p>
                                    {selectedEmail.body && selectedEmail.body !== selectedEmail.preview && (
                                        <details>
                                            <summary>View Full Email Content</summary>
                                            <div className="full-email-body">
                                                {selectedEmail.body.split('\n').map((line, index) => (
                                                    <p key={index}>{line}</p>
                                                ))}
                                            </div>
                                        </details>
                                    )}
                                </div>
                                
                                <button 
                                    className="process-btn"
                                    onClick={handleProcessEmail}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? '🤖 Processing...' : '🤖 Process with AI'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="no-selection">
                            <h2>Select an email to view details</h2>
                            <p>Click on any email from the list to see its content and process it with AI.</p>
                            <div className="stats">
                                <p>📊 <strong>{emails.length}</strong> financial emails loaded</p>
                                <p>🔍 Filtered from Bolero, KBC, ING, and other financial sources</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    ⚠️ {error}
                    <button onClick={() => setError('')}>✕</button>
                </div>
            )}

            <footer className="app-footer">
                <p>✅ Gmail API connected! Next: Ollama AI integration for Dutch translation</p>
            </footer>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FinancialEmailApp />);
