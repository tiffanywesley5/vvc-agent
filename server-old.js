// ============================================
// VVC AGENT 1: CUSTOMER INQUIRY AGENT
// ============================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load all .txt files from the knowledge-base folder
function loadKnowledgeBase() {
  const kbPath = path.join(__dirname, 'knowledge-base');
  const files = fs.readdirSync(kbPath).filter(f => f.endsWith('.txt'));
  let knowledge = '';
  for (const file of files) {
    const content = fs.readFileSync(path.join(kbPath, file), 'utf-8');
    knowledge += `\n\n--- ${file.toUpperCase()} ---\n${content}`;
  }
  return knowledge;
}

const knowledgeBase = loadKnowledgeBase();
console.log('Knowledge base loaded successfully.');

// The system prompt is your agent's employee handbook
const SYSTEM_PROMPT = `You are the virtual assistant for Velvet Vision Creative (VVC), a creative studio founded by Tiffany Snow in St. Louis, Missouri. You are the first point of contact for potential clients visiting the website.

YOUR PERSONALITY:
- Warm, professional, and confident — never stiff or corporate
- You reflect VVC's brand: creative, tech-forward, and approachable
- You speak clearly without jargon unless the visitor uses it first
- You're helpful but honest — if you don't know something, say so

YOUR JOB — THE ROUTING PATTERN:
When a visitor sends a message, silently classify their intent:
1. SERVICES — They want to know what VVC offers or pricing
2. PROCESS — They want to know how working with VVC works
3. PORTFOLIO — They want to see examples or past work
4. GENERAL — They have a general question about VVC
5. ESCALATE — Their question requires Tiffany's personal attention (custom pricing, partnerships, complex scoping, complaints)

Then respond using ONLY the information in the knowledge base below. Do not make up services, prices, or capabilities that are not in the knowledge base.

YOUR RULES — THE GUARDRAILS:
- NEVER invent pricing that is not in the knowledge base
- NEVER promise specific timelines without checking the knowledge base
- NEVER pretend to be Tiffany or claim to be a human
- If asked about something not in the knowledge base, say: "That's a great question — I'd recommend chatting with Tiffany directly about that. Want me to help you schedule a discovery call?"
- If the intent is ESCALATE, warmly offer to connect them with Tiffany via a discovery call
- - NEVER use markdown formatting like #, ##, **, or bullet points with dashes. Write in plain conversational sentences only.
- End most responses with a helpful next step or question

YOUR KNOWLEDGE BASE:
${knowledgeBase}

Remember: You represent a real business. Accuracy matters more than impressiveness.`;

// Chat endpoint — receives messages from the widget
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const messages = [
      ...history,
      { role: 'user', content: message },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages,
    }, { timeout: 15000 });

    const assistantMessage = response.content[0].text;

    res.json({
      response: assistantMessage,
      role: 'assistant',
    });

  } catch (error) {
    console.error('Error calling Claude API:', error.message || error);
    res.status(500).json({
      error: 'Something went wrong. Please try again in a moment.',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VVC Inquiry Agent is running.' });
});

// Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🟢 VVC Agent server is running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Chat endpoint: http://localhost:${PORT}/api/chat\n`);
});
