import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// Main App Component
function FinancialEmailApp() {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Sample email data (we'll replace this with real Gmail API later)
    const sampleEmails = [
        {
            id: 1,
            subject: "Beurs bij 't Ontbijt 18/9/2025",
            from: "Bolero <noreply@bolero.be>",
            date: "2025-09-18",
            preview: "De markten zijn vandaag voorzichtig optimistisch gestart...",
            isFinancial: true
        },
        {
            id: 2,
            subject: "Marktupdate KBC",
            from: "KBC <updates@kbc.be>",
            date: "2025-09-17",
            preview: "Belangrijke ontwikkelingen in de financiële markten...",
            isFinancial: true
        },
        {
            id: 3,
            subject: "Weekly Portfolio Report",
            from: "eToro <reports@etoro.com>",
            date: "2025-09-16",
            preview: "Your portfolio performance this week...",
            isFinancial: true
        }
    ];

    // Load sample emails on component mount
    useEffect(() => {
        setEmails(sampleEmails);
    }, []);

    const handleEmailSelect = (email) => {
        setSelectedEmail(email);
    };

    const handleProcessEmail = async () => {
        if (!selectedEmail) return;
        
        setIsProcessing(true);
        // Simulate AI processing delay
        setTimeout(() => {
            setIsProcessing(false);
            alert(`Processing email: ${selectedEmail.subject}\n\nThis will connect to your Ollama AI in the next step!`);
        }, 2000);
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>🇧🇪 Financial Email Assistant</h1>
                <p>React + Electron Desktop App</p>
            </header>

            <div className="app-content">
                <div className="email-list">
                    <h2>📧 Financial Emails</h2>
                    {emails.map(email => (
                        <button 
                            key={email.id}
                            className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''}`}
                            onClick={() => handleEmailSelect(email)}
                        >
                            <div className="email-subject">{email.subject}</div>
                            <div className="email-from">{email.from}</div>
                            <div className="email-preview">{email.preview}</div>
                            <div className="email-date">{email.date}</div>
                        </button>
                    ))}
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
                                    <p>{selectedEmail.preview}</p>
                                    <p><em>Full email content would be loaded here...</em></p>
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
                        </div>
                    )}
                </div>
            </div>

            <footer className="app-footer">
                <p>✅ React is working! Next: Gmail API integration</p>
            </footer>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FinancialEmailApp />);
