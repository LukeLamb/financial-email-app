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
    
    // Ollama AI state
    const [ollamaConnected, setOllamaConnected] = useState(false);
    const [availableModels, setAvailableModels] = useState([
        { name: 'mistral:latest', size: 4.4e9 },
        { name: 'phi3:latest', size: 2.2e9 },
        { name: 'codellama:latest', size: 3.8e9 },
        { name: 'llama3:latest', size: 4.7e9 },
        { name: 'llama3.1:8b', size: 4.9e9 },
        { name: 'gpt-oss:20b', size: 13e9 },
        { name: 'gpt-oss:20b-trader', size: 13e9 }
    ]);
    const [selectedModel, setSelectedModel] = useState('mistral:latest');
    const [processingMode, setProcessingMode] = useState('translate');
    const [aiResult, setAiResult] = useState(null);

    // Initialize Gmail API on component mount
    useEffect(() => {
        initializeGmail();
        initializeOllama();
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

    const initializeOllama = async () => {
        try {
            console.log('🤖 Initializing Ollama connection...');
            const connectionResult = await window.ollamaAPI.checkConnection();
            
            if (connectionResult.success) {
                setOllamaConnected(true);
                const models = connectionResult.models || [];
                setAvailableModels(models);
                console.log('✅ Ollama connected successfully');
                console.log('📋 Models loaded into React:', models.length);
                
                // Set a good default model based on what's available
                if (models.length > 0) {
                    // Prefer smaller, faster models first
                    const preferredModel = models.find(m => m.name.includes('phi3')) ||
                                         models.find(m => m.name.includes('mistral')) ||
                                         models.find(m => m.name.includes('llama3.1')) ||
                                         models.find(m => m.name.includes('llama3') && !m.name.includes('llama3.1')) ||
                                         models[0];
                    
                    if (preferredModel) {
                        setSelectedModel(preferredModel.name);
                        await window.ollamaAPI.setModel(preferredModel.name);
                        console.log(`🎯 Default model set to: ${preferredModel.name}`);
                    }
                }
            } else {
                setOllamaConnected(false);
                console.log('⚠️ Ollama not available:', connectionResult.error);
            }
        } catch (error) {
            console.error('❌ Ollama initialization failed:', error);
            setOllamaConnected(false);
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
        
        if (!ollamaConnected) {
            alert('Ollama AI is not connected. Please make sure Ollama is running and try refreshing the page.');
            return;
        }
        
        setIsProcessing(true);
        setAiResult(null);
        
        try {
            console.log(`🤖 Processing email with ${selectedModel} in ${processingMode} mode`);
            
            const result = await window.ollamaAPI.processEmail(selectedEmail, processingMode);
            
            if (result.success) {
                setAiResult(result);
                console.log('✅ AI processing completed successfully');
            } else {
                setError(`AI processing failed: ${result.error}`);
                console.error('❌ AI processing failed:', result.error);
            }
        } catch (error) {
            setError(`AI processing error: ${error.message}`);
            console.error('❌ AI processing error:', error);
        } finally {
            setIsProcessing(false);
        }
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

    const renderEmailList = () => {
        if (emails.length === 0) {
            return (
                <div className="no-emails">
                    <p>📭 No financial emails found</p>
                    <p>Try refreshing or check your email filters</p>
                </div>
            );
        }

        return (
            <>
                {emails.map(email => (
                    <button 
                        key={email.id}
                        className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                        onClick={() => handleEmailSelect(email)}
                        type="button"
                    >
                        <div className="email-subject">{email.subject}</div>
                        <div className="email-from">{email.from}</div>
                        <div className="email-preview">{email.preview}</div>
                        <div className="email-date">{email.date}</div>
                    </button>
                ))}
            </>
        );
    };

    // Function to render authentication content
    const renderAuthContent = () => {
        if (isLoading) {
            return (
                <div className="loading">
                    <h2>🔄 Initializing Gmail API...</h2>
                    <p>Please wait while we set up your connection.</p>
                </div>
            );
        }
        
        if (authUrl) {
            return (
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
            );
        }
        
        return (
            <div className="auth-error">
                <h2>❌ Authentication Setup Failed</h2>
                <p>Please check your credentials.json file and try again.</p>
                <button className="retry-btn" onClick={initializeGmail}>
                    🔄 Retry Setup
                </button>
            </div>
        );
    };

    // Authentication Screen
    if (!isAuthenticated) {
        return (
            <div className="app">
                <header className="app-header">
                    <h1>Financial Email Assistant</h1>
                    <p>Gmail Authentication Required</p>
                </header>

                <div className="auth-container">
                    {renderAuthContent()}

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
                <h1>Financial Email Assistant</h1>
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
                        <h2>💰 Financial Emails ({emails.length})</h2>
                        <button 
                            className="refresh-btn" 
                            onClick={handleRefreshEmails}
                            disabled={isLoading}
                        >
                            {isLoading ? '🔄' : '↻'} Refresh
                        </button>
                    </div>
                    
                    <div className="email-items-container">
                        {isLoading ? (
                            <div className="loading-emails">
                                <p>🔄 Loading your financial emails...</p>
                            </div>
                        ) : (
                            renderEmailList()
                        )}
                    </div>
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
                                    
                                    {(selectedEmail.htmlBody || selectedEmail.plainTextBody) && (
                                        <details>
                                            <summary>View Full Email Content</summary>
                                            <div className="full-email-content">
                                                {selectedEmail.hasHtml && selectedEmail.hasPlainText && (
                                                    <div className="content-format-selector">
                                                        <button 
                                                            className={`format-btn ${
                                                                selectedEmail.viewMode === 'html' ? 'active' : ''
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedEmail({
                                                                    ...selectedEmail, 
                                                                    viewMode: 'html'
                                                                });
                                                            }}
                                                        >
                                                            📄 HTML Format
                                                        </button>
                                                        <button 
                                                            className={`format-btn ${
                                                                selectedEmail.viewMode === 'text' ? 'active' : ''
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedEmail({
                                                                    ...selectedEmail, 
                                                                    viewMode: 'text'
                                                                });
                                                            }}
                                                        >
                                                            📝 Plain Text
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {selectedEmail.hasHtml && (!selectedEmail.viewMode || selectedEmail.viewMode === 'html') && (
                                                    <div className="html-email-content">
                                                        <div 
                                                            className="html-email-body"
                                                            dangerouslySetInnerHTML={{ 
                                                                __html: selectedEmail.htmlBody 
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                
                                                {selectedEmail.hasPlainText && (selectedEmail.viewMode === 'text' || !selectedEmail.hasHtml) && (
                                                    <div className="plain-text-email-content">
                                                        <div className="plain-text-email-body">
                                                            {selectedEmail.plainTextBody.split('\n').map((line, index) => (
                                                                <p key={index}>{line}</p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {!selectedEmail.hasHtml && !selectedEmail.hasPlainText && (
                                                    <p className="no-content">No readable content available for this email.</p>
                                                )}
                                            </div>
                                        </details>
                                    )}
                                </div>
                                
                                {/* AI Processing Controls */}
                                <div className="ai-processing-section">
                                    <div className="ai-controls">
                                        <div className="ai-status">
                                            {ollamaConnected ? (
                                                <span className="status-connected">✅ Ollama Connected</span>
                                            ) : (
                                                <span className="status-disconnected">❌ Ollama Disconnected</span>
                                            )}
                                        </div>
                                        
                                        {ollamaConnected && (
                                            <div className="ai-options">
                                                <div className="model-selector">
                                                    <label>AI Model:</label>
                                                    <select 
                                                        value={selectedModel}
                                                        onChange={(e) => {
                                                            setSelectedModel(e.target.value);
                                                            window.ollamaAPI.setModel(e.target.value);
                                                        }}
                                                        className="model-select"
                                                    >
                                                        {availableModels.length === 0 ? (
                                                            <option value="">No models available</option>
                                                        ) : (
                                                            availableModels.map(model => (
                                                                <option key={model.name} value={model.name}>
                                                                    {model.name} ({(model.size / 1e9).toFixed(1)}GB)
                                                                </option>
                                                            ))
                                                        )}
                                                    </select>
                                                </div>
                                                
                                                <div className="mode-selector">
                                                    <label>Processing Mode:</label>
                                                    <div className="mode-buttons">
                                                        <button 
                                                            className={`mode-btn ${processingMode === 'translate' ? 'active' : ''}`}
                                                            onClick={() => setProcessingMode('translate')}
                                                        >
                                                            🔄 Translate
                                                        </button>
                                                        <button 
                                                            className={`mode-btn ${processingMode === 'summarize' ? 'active' : ''}`}
                                                            onClick={() => setProcessingMode('summarize')}
                                                        >
                                                            📄 Summarize
                                                        </button>
                                                        <button 
                                                            className={`mode-btn ${processingMode === 'both' ? 'active' : ''}`}
                                                            onClick={() => setProcessingMode('both')}
                                                        >
                                                            🤩 Both
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <button 
                                    className="process-btn"
                                    onClick={handleProcessEmail}
                                    disabled={isProcessing || !ollamaConnected}
                                >
                                    {isProcessing ? '🤖 Processing...' : '🤖 Process with AI'}
                                </button>
                                
                                {/* AI Results Display */}
                                {aiResult && (
                                    <div className="ai-results">
                                        <h3>🎉 AI Processing Results</h3>
                                        
                                        {aiResult.translation && (
                                            <div className="ai-translation">
                                                <h4>🔄 Translation ({aiResult.originalLanguage} → {aiResult.targetLanguage})</h4>
                                                <div className="translation-content">
                                                    {aiResult.translation.split('\n').map((line, index) => (
                                                        <p key={index}>{line}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {aiResult.analysis && (
                                            <div className="ai-analysis">
                                                <h4>📈 Enhanced Financial Analysis</h4>
                                                <div className="analysis-content">
                                                    {typeof aiResult.analysis === 'object' ? (
                                                        <div>
                                                            <div className="analysis-item">
                                                                <strong>Executive Summary:</strong>
                                                                <p>{aiResult.analysis.summary}</p>
                                                            </div>
                                                            <div className="analysis-item">
                                                                <strong>Key Investment Insights:</strong>
                                                                <p>{aiResult.analysis.keyInsights}</p>
                                                            </div>
                                                            <div className="analysis-item">
                                                                <strong>Important Details & Actions:</strong>
                                                                <p>{aiResult.analysis.importantDetails}</p>
                                                            </div>
                                                            {aiResult.analysis.investmentImplications && (
                                                                <div className="analysis-item">
                                                                    <strong>Investment Implications:</strong>
                                                                    <p>{aiResult.analysis.investmentImplications}</p>
                                                                </div>
                                                            )}
                                                            {aiResult.analysis.mentionedStocks && aiResult.analysis.mentionedStocks.length > 0 && (
                                                                <div className="analysis-item">
                                                                    <strong>Mentioned Securities:</strong>
                                                                    <div className="stock-tags">
                                                                        {aiResult.analysis.mentionedStocks.map((stock, index) => (
                                                                            <span key={index} className="stock-tag">{stock}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {aiResult.analysis.riskFactors && (
                                                                <div className="analysis-item risk-section">
                                                                    <strong>⚠️ Risk Factors:</strong>
                                                                    <p>{aiResult.analysis.riskFactors}</p>
                                                                </div>
                                                            )}
                                                            <div className="analysis-item">
                                                                <strong>Market Sentiment:</strong>
                                                                <span className={`sentiment ${aiResult.analysis.sentiment}`}>
                                                                    {aiResult.analysis.sentiment}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p>{aiResult.analysis}</p>
                                                            {aiResult.fullAnalysis && (
                                                                <div className="full-analysis">
                                                                    <strong>Detailed Analysis:</strong>
                                                                    <div className="analysis-text">
                                                                        {aiResult.fullAnalysis.split('\n').map((line, index) => (
                                                                            <p key={index}>{line}</p>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
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
