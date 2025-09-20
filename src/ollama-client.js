class OllamaClient {
    constructor() {
        this.baseUrl = 'http://localhost:11434';
        this.defaultModel = 'llama3.2'; // You can change this to your preferred model
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Ollama connected, available models:', data.models?.length || 0);
                return { success: true, models: data.models || [] };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ Ollama connection failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async translateEmail(emailContent, fromLanguage = 'Dutch', toLanguage = 'English') {
        try {
            const prompt = `You are a professional financial translator. Translate the following ${fromLanguage} financial email content to ${toLanguage}. 

Maintain all financial terms, company names, dates, and numerical values exactly as they appear. Focus on clear, professional translation that preserves the original meaning and context.

Email content to translate:
${emailContent}

Provide only the translation, no additional commentary.`;

            console.log('🔄 Translating email content...');
            
            const response = await this.generateResponse(prompt);
            
            if (response.success) {
                console.log('✅ Email translation completed');
                return {
                    success: true,
                    translation: response.content,
                    originalLanguage: fromLanguage,
                    targetLanguage: toLanguage
                };
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('❌ Translation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async summarizeEmail(emailContent, language = 'English') {
        try {
            const prompt = `You are a financial analyst. Analyze the following financial email and provide a concise summary with key insights.

Email content:
${emailContent}

Please provide:
1. A brief summary (2-3 sentences)
2. Key financial information or market insights
3. Any important dates, numbers, or action items
4. Overall sentiment (positive/negative/neutral)

Format your response as JSON with these fields: summary, keyInsights, importantDetails, sentiment`;

            console.log('🔄 Analyzing email content...');
            
            const response = await this.generateResponse(prompt);
            
            if (response.success) {
                try {
                    // Try to parse as JSON, fallback to plain text if it fails
                    const analysis = JSON.parse(response.content);
                    console.log('✅ Email analysis completed (structured)');
                    return {
                        success: true,
                        analysis: analysis,
                        format: 'structured'
                    };
                } catch (parseError) {
                    console.log('✅ Email analysis completed (plain text)');
                    return {
                        success: true,
                        analysis: {
                            summary: response.content,
                            keyInsights: 'See summary above',
                            importantDetails: 'See summary above', 
                            sentiment: 'neutral'
                        },
                        format: 'plain'
                    };
                }
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('❌ Email analysis failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async processFinancialEmail(emailData, mode = 'translate') {
        try {
            console.log(`🤖 Processing email: ${emailData.subject} (mode: ${mode})`);
            
            // Choose content to process (prefer HTML, fallback to plain text)
            let content = emailData.htmlBody || emailData.plainTextBody;
            
            if (!content) {
                throw new Error('No readable content found in email');
            }

            // Strip HTML tags if processing HTML content
            if (emailData.htmlBody && content === emailData.htmlBody) {
                content = this.stripHtmlTags(content);
            }

            // Truncate very long emails to avoid token limits
            if (content.length > 4000) {
                content = content.substring(0, 4000) + '...[content truncated]';
                console.log('⚠️ Email content truncated due to length');
            }

            let result;
            
            switch (mode) {
                case 'translate':
                    result = await this.translateEmail(content);
                    break;
                case 'summarize':
                    result = await this.summarizeEmail(content);
                    break;
                case 'both':
                    const translation = await this.translateEmail(content);
                    if (translation.success) {
                        const summary = await this.summarizeEmail(translation.translation, 'English');
                        result = {
                            success: true,
                            translation: translation.translation,
                            analysis: summary.success ? summary.analysis : null,
                            mode: 'both'
                        };
                    } else {
                        result = translation;
                    }
                    break;
                default:
                    throw new Error(`Unknown processing mode: ${mode}`);
            }

            if (result.success) {
                console.log(`✅ Email processing completed (${mode})`);
            }

            return result;

        } catch (error) {
            console.error('❌ Email processing failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async generateResponse(prompt, model = null) {
        try {
            const requestModel = model || this.defaultModel;
            
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: requestModel,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.3, // Lower temperature for more consistent translations
                        top_p: 0.9,
                        max_tokens: 1000
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            return {
                success: true,
                content: data.response,
                model: requestModel,
                context: data.context
            };

        } catch (error) {
            console.error('❌ Ollama generation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    stripHtmlTags(html) {
        // Simple HTML tag removal for AI processing
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
            .replace(/<[^>]*>/g, ' ') // Remove all HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/&nbsp;/g, ' ') // Replace HTML entities
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();
    }

    async getAvailableModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                return { success: true, models: data.models || [] };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Set the model to use for AI processing
    setModel(modelName) {
        this.defaultModel = modelName;
        console.log(`🤖 Ollama model set to: ${modelName}`);
    }
}

module.exports = OllamaClient;
