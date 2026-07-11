// GET /api/content/:section
// Returns static/semi-static homepage content by section name.
// In a full CMS integration this would be DB-driven; for now it's structured data.

const sections = {
  hero: {
    headline: 'Train Smarter.\nLive Stronger.',
    subheadline:
      'FitFlow connects you with elite coaches, intelligent training plans, and real-time analytics — all in one platform built for serious athletes.',
    ctaPrimary: { label: 'Start Free Trial', href: '/register' },
    ctaSecondary: { label: 'See How It Works', href: '/features' },
    stats: [
      { value: '12,000+', label: 'Athletes Trained' },
      { value: '98%', label: 'Goal Achievement Rate' },
      { value: '300+', label: 'Expert Coaches' },
    ],
  },
  testimonials: [
    {
      id: '1',
      name: 'Marcus Rivera',
      role: 'Marathon Runner',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
      quote:
        'FitFlow cut my marathon time by 18 minutes in 6 months. The adaptive coaching is unlike anything I\'ve tried before.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Priya Nair',
      role: 'CrossFit Athlete',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
      quote:
        'The nutrition tracking + workout sync is a game changer. My coach updates my plan in real-time based on my recovery data.',
      rating: 5,
    },
    {
      id: '3',
      name: 'James Okafor',
      role: 'Personal Trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      quote:
        'I run 40 clients through FitFlow. The dashboard gives me everything I need — no more spreadsheets, no more guessing.',
      rating: 5,
    },
  ],
  about: {
    headline: 'Built by athletes, for athletes.',
    body: 'FitFlow was founded in 2022 by a team of coaches and engineers who were frustrated by generic fitness apps. We built the platform we wished existed — one that adapts to you, connects you with real expertise, and makes data-driven training accessible to everyone.',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
    values: [
      { title: 'Performance-First', description: 'Every feature is built around measurable outcomes, not engagement metrics.' },
      { title: 'Coach-Powered', description: 'Real human expertise behind every adaptive recommendation.' },
      { title: 'Privacy Respected', description: 'Your biometric data is yours. We never sell it.' },
    ],
  },
};

const getSection = (req, res) => {
  const { section } = req.params;
  const data = sections[section];
  if (!data) {
    return res.status(404).json({ success: false, message: `Section "${section}" not found` });
  }
  res.json({ success: true, data });
};

module.exports = { getSection };
