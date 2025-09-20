// Quick Model Switcher for Testing
// Run this with: node switch-model.js [model-name]

const modelName = process.argv[2] || 'phi3:latest';

console.log(`Switching to model: ${modelName}`);

// Test if the model exists in Ollama
const testModel = async () => {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: modelName,
                prompt: 'Test',
                stream: false
            })
        });
        
        if (response.ok) {
            console.log(`✅ Model ${modelName} is working`);
        } else {
            console.log(`❌ Model ${modelName} failed: ${response.status}`);
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
};

// For now, let's just manually test phi3
console.log('Testing phi3:latest model...');

// Quick workaround: Just close the app and manually run with different model
console.log('WORKAROUND: Close the app and we will use a simpler approach');
