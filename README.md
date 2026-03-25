# VVC Agent 1: Customer Inquiry Agent

## What This Is
A chat widget that lives on your VVC website and answers visitor
questions 24/7 using your real business information. It routes
questions by intent, pulls answers from your knowledge base,
and knows when to escalate to you.

---

## STEP 1: Get Your Anthropic API Key (5 minutes)

1. Open your browser and go to: https://console.anthropic.com
2. Click "Sign Up" (use your VVC email)
3. Verify your email
4. Once logged in, click "API Keys" in the left sidebar
5. Click "Create Key"
6. Name it: vvc-inquiry-agent
7. COPY THE KEY IMMEDIATELY (you will not see it again)
8. Paste it somewhere safe (Notes app, password manager, etc.)

Cost: You will need to add a payment method. Claude Haiku costs
about $0.25 per million tokens. For a small business, expect
$5-10/month maximum.

---

## STEP 2: Install Node.js (5 minutes, skip if already installed)

Open your Terminal app (Mac: search "Terminal" in Spotlight)

Check if Node.js is already installed:
```
node --version
```

If you see a version number like v18+ or v20+, skip to Step 3.

If not, install it:
- Go to https://nodejs.org
- Download the LTS version (the green button)
- Run the installer, click Next through everything
- Close and reopen Terminal
- Run `node --version` again to confirm

---

## STEP 3: Install a Code Editor (5 minutes, skip if you have one)

Download Visual Studio Code (free):
https://code.visualstudio.com

This is where you will edit your knowledge base files and code.

---

## STEP 4: Set Up the Project (5 minutes)

In Terminal, navigate to where you want the project:
```
cd ~/Desktop
```

Create and enter the project folder:
```
mkdir vvc-inquiry-agent
cd vvc-inquiry-agent
```

Copy ALL the files from this download into that folder.
Your folder should look like this:
```
vvc-inquiry-agent/
  .env.example
  .gitignore
  package.json
  server.js
  README.md
  knowledge-base/
    services.txt
    about.txt
    process.txt
    faq.txt
  public/
    index.html
```

---

## STEP 5: Add Your API Key (2 minutes)

In Terminal (make sure you are inside the vvc-inquiry-agent folder):
```
cp .env.example .env
```

Open the .env file in VS Code:
```
code .env
```

Replace the placeholder with your real API key:
```
ANTHROPIC_API_KEY=sk-ant-paste-your-real-key-here
PORT=3001
```

Save the file (Cmd+S on Mac).

IMPORTANT: Never share this file. Never upload it to GitHub.

---

## STEP 6: Install Dependencies (1 minute)

In Terminal:
```
npm install
```

You should see it download some packages. If you see
"found 0 vulnerabilities" at the end, you are good.

---

## STEP 7: Customize Your Knowledge Base (30-60 minutes)

This is the MOST IMPORTANT STEP. Open each file in the
knowledge-base/ folder and replace the placeholder content
with your real VVC information.

Open them in VS Code:
```
code knowledge-base/
```

Edit these four files:
- services.txt — your real services and real pricing
- about.txt — who you are, your philosophy, who you serve
- process.txt — how working with VVC actually works
- faq.txt — every question clients ask you more than twice

Write these like you are training the best employee you
have ever had. Be specific. Include real numbers.

---

## STEP 8: Start the Agent (1 minute)

In Terminal:
```
node server.js
```

You should see:
```
Knowledge base loaded successfully.

🟢 VVC Agent server is running at http://localhost:3001
   Health check: http://localhost:3001/api/health
   Chat endpoint: http://localhost:3001/api/chat
```

---

## STEP 9: Test It (10 minutes)

Open your browser and go to: http://localhost:3001

You will see a chat bubble in the bottom-right corner.
Click it and test with these questions:

- "What services do you offer?"
- "How much does a website cost?"
- "How does your process work?"
- "Do you work with clients outside St. Louis?"
- "I need a custom enterprise solution" (should escalate)
- "Can you do my taxes?" (should deflect)

If an answer is wrong, the fix is editing your knowledge
base files, NOT the code. Update the file, restart the
server (Ctrl+C then `node server.js`), and test again.

---

## STEP 10: Deploy to the Internet (15 minutes)

Once it works locally, put it online.

### Option A: Render.com (Free tier, recommended to start)

1. Create a GitHub account if you do not have one: github.com
2. Push your code to GitHub (without the .env file):
   ```
   git init
   git add .
   git commit -m "VVC inquiry agent"
   ```
   Then create a new repo on github.com and follow their
   instructions to push.

3. Go to https://render.com and sign up
4. Click "New" then "Web Service"
5. Connect your GitHub repo
6. Settings:
   - Build Command: npm install
   - Start Command: node server.js
7. Go to "Environment" tab
8. Add variable: ANTHROPIC_API_KEY = your key
9. Click Deploy

You will get a URL like: https://vvc-agent.onrender.com

### Option B: Vercel (you already have Vercel connected)
We can convert this to a Vercel serverless function together
when you are ready. Just ask.

---

## STEP 11: Add to Your VVC Website

Once deployed, you add the chat widget to your real site by:

1. Open public/index.html
2. Copy everything between <!-- CHAT TOGGLE BUTTON --> and
   the closing </script> tag
3. In the JavaScript, change API_URL to your deployed URL:
   const API_URL = 'https://your-app.onrender.com/api/chat';
4. Paste into your VVC website before the closing </body> tag
5. Also copy the CSS styles from the <style> section

---

## Troubleshooting

"Cannot find module" error:
  Run `npm install` again.

"Invalid API key" error:
  Check your .env file. Make sure the key starts with sk-ant-

Server starts but chat gives no response:
  Check Terminal for error messages. Usually means the API
  key is wrong or you ran out of credits.

Chat gives wrong answers:
  Update your knowledge base files. The agent only knows
  what you tell it.

---

## What Comes Next

Agent 1 is your customer inquiry agent (this project).
Agent 2 is your content agent (auto-drafts posts and blogs).
Agent 3 is your market research agent (scans trends weekly).

Build Agent 1 first. Get it live. Then we build the next one.
