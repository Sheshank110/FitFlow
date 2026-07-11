const ChatLog = require('../models/ChatLog');

// Rule-based fallback responder
const fallbackRespond = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes('price') || msg.includes('cost') || msg.includes('plan') || msg.includes('pricing')) {
    return 'FitFlow offers three plans: **Free** (basic tracking), **Pro** at $29/month (coaching + analytics), and **Elite** at $79/month (unlimited coaching + priority support). You can see full details on our Pricing page!';
  }
  if (msg.includes('coach') || msg.includes('trainer')) {
    return 'FitFlow connects you with 300+ certified coaches across strength, endurance, CrossFit, and nutrition. On the Pro and Elite plans, your coach reviews your data and updates your training plan weekly.';
  }
  if (msg.includes('cancel') || msg.includes('subscription')) {
    return 'You can cancel your subscription anytime — no lock-in contracts. Head to your Dashboard > Settings > Billing to cancel. You\'ll retain access until the end of your billing period.';
  }
  if (msg.includes('app') || msg.includes('mobile') || msg.includes('android') || msg.includes('ios')) {
    return 'FitFlow has native iOS and Android apps! Download them from the App Store or Google Play and sync with your web dashboard seamlessly.';
  }
  if (msg.includes('nutrition') || msg.includes('diet') || msg.includes('food') || msg.includes('meal')) {
    return 'FitFlow\'s nutrition module includes macro tracking, meal logging, hydration reminders, and coach-reviewed meal plans. It syncs with your training load to auto-adjust your calorie targets.';
  }
  if (msg.includes('analytics') || msg.includes('data') || msg.includes('progress') || msg.includes('track')) {
    return 'FitFlow\'s analytics dashboard shows your strength progression, cardiovascular fitness trends, body composition, sleep quality, and recovery score — all in one place with beautiful charts.';
  }
  if (msg.includes('free trial') || msg.includes('trial') || msg.includes('try')) {
    return 'Yes! FitFlow offers a 14-day free trial on all paid plans — no credit card required. Just sign up and pick the plan you want to try.';
  }
  if (msg.includes('support') || msg.includes('help') || msg.includes('contact')) {
    return 'Our support team is available 7 days a week via the Contact page. Elite plan members get priority support with a 2-hour response guarantee.';
  }
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg === 'hi' || msg === 'hello') {
    return 'Hey there! 👋 I\'m FitBot, your FitFlow assistant. Ask me anything about our training plans, coaching, pricing, or features!';
  }

  return "Great question! I'm not sure about that specific topic, but our team can help. Visit our Contact page or check out the FAQ section. I can also answer questions about pricing, coaching, features, nutrition, and more!";
};

// POST /api/chat
const chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ success: false, message: 'message and sessionId are required' });
    }

    // Save user message
    await ChatLog.create({ sessionId, role: 'user', content: message });

    let reply = '';
    let modelUsed = 'fallback';

    // Try Claude API
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const Anthropic = require('@anthropic-ai/sdk');
        const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });

        // Fetch last 6 messages for context
        const history = await ChatLog.find({ sessionId })
          .sort({ createdAt: -1 })
          .limit(7)
          .lean();

        const messages = history
          .reverse()
          .slice(0, -1) // exclude the message we just saved (will be added as current)
          .map((m) => ({ role: m.role, content: m.content }));

        messages.push({ role: 'user', content: message });

        const response = await client.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 400,
          system: `You are FitBot, the friendly AI assistant for FitFlow — a fitness coaching SaaS platform.

FitFlow helps athletes and fitness enthusiasts connect with expert coaches, track training data, monitor nutrition, and achieve their fitness goals.

Key facts:
- Plans: Free (basic), Pro ($29/mo — coaching + analytics), Elite ($79/mo — unlimited coaching + priority support)
- 300+ certified coaches: strength, endurance, CrossFit, nutrition
- Features: adaptive training plans, nutrition tracking, recovery analytics, progress charts, mobile app
- 14-day free trial on all paid plans, no credit card required
- Cancel anytime, no lock-in
- Support: Contact page, 7 days/week; Elite gets 2-hour response guarantee

Keep responses concise (2-3 sentences max), helpful, and energetic. Stay on-topic — for billing disputes or account issues, direct to the Contact page for human support. Do not discuss competitors.`,
          messages,
        });

        reply = response.content[0].text;
        modelUsed = 'claude-3-haiku-20240307';
      } catch (claudeErr) {
        console.error('Claude API error, falling back:', claudeErr.message);
        reply = fallbackRespond(message);
      }
    } else {
      reply = fallbackRespond(message);
    }

    // Save assistant reply
    await ChatLog.create({ sessionId, role: 'assistant', content: reply, model: modelUsed });

    res.json({ success: true, reply, model: modelUsed });
  } catch (err) {
    next(err);
  }
};

module.exports = { chat };
