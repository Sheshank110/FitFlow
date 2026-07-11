require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Feature = require('./models/Feature');
const Pricing = require('./models/Pricing');
const Post = require('./models/Post');
const User = require('./models/User');

const features = [
  {
    title: 'Adaptive Training Plans',
    description: 'AI-powered plans that evolve weekly based on your performance data, recovery metrics, and coach feedback. No two athletes get the same program.',
    icon: 'zap',
    category: 'training',
    highlight: true,
    order: 1,
  },
  {
    title: 'Live Coach Access',
    description: 'Direct messaging and weekly video check-ins with your assigned certified coach. Real expertise, not just algorithms.',
    icon: 'users',
    category: 'coaching',
    highlight: true,
    order: 2,
  },
  {
    title: 'Performance Analytics',
    description: 'Track every rep, mile, and macro with beautiful real-time dashboards. Spot trends before they become problems.',
    icon: 'bar-chart',
    category: 'analytics',
    highlight: true,
    order: 3,
  },
  {
    title: 'Nutrition Intelligence',
    description: 'Smart macro tracking that auto-adjusts to your training load. Log meals in seconds, get coach-approved meal plans tailored to your goals.',
    icon: 'leaf',
    category: 'nutrition',
    highlight: false,
    order: 4,
  },
  {
    title: 'Recovery Monitoring',
    description: 'HRV tracking, sleep quality scoring, and readiness assessments that tell you exactly when to push and when to rest.',
    icon: 'heart',
    category: 'analytics',
    highlight: false,
    order: 5,
  },
  {
    title: 'Community Challenges',
    description: 'Monthly challenges, leaderboards, and team events that make training social without distracting from your goals.',
    icon: 'trophy',
    category: 'community',
    highlight: false,
    order: 6,
  },
];

const pricing = [
  {
    name: 'Free',
    price: 0,
    description: 'Start your journey. Core tracking tools with no commitment.',
    features: [
      'Workout logging',
      'Basic progress charts',
      'Access to 50+ workout templates',
      'Community feed',
      'Mobile app',
    ],
    isPopular: false,
    ctaLabel: 'Get Started Free',
    order: 1,
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For serious athletes who want a real competitive edge.',
    features: [
      'Everything in Free',
      'Adaptive training plans',
      '1 dedicated coach',
      'Weekly coach reviews',
      'Full analytics dashboard',
      'Nutrition tracking + meal plans',
      'Priority email support',
    ],
    isPopular: true,
    ctaLabel: 'Start 14-Day Trial',
    order: 2,
  },
  {
    name: 'Elite',
    price: 79,
    description: 'Maximum performance. For athletes who train at the highest level.',
    features: [
      'Everything in Pro',
      'Unlimited coach access',
      'Daily check-ins',
      'Recovery & HRV monitoring',
      'Custom supplement protocols',
      'Video analysis of your technique',
      '2-hour support response guarantee',
      'Early access to new features',
    ],
    isPopular: false,
    ctaLabel: 'Go Elite',
    order: 3,
  },
];

const posts = [
  {
    title: 'Why Your Training Plateau Is Actually Good News',
    slug: 'training-plateau-good-news',
    excerpt: 'Hitting a wall in your progress? Here\'s the counterintuitive truth about plateaus — and the three adjustments that break them every time.',
    body: `# Why Your Training Plateau Is Actually Good News

A training plateau feels like failure. You've been putting in the work, logging consistent sessions, eating right — and then nothing. The scale doesn't budge. The weights feel the same. Your times stop improving.

Here's what coaches know that most athletes don't: **a plateau is your body telling you it's adapted to your current stimulus**. That's not failure — that's success. It means your training *worked*. Now it's time to change the signal.

## The Three Levers That Break Plateaus

### 1. Progressive Overload Variation
Most athletes increase weight linearly. When that stops working, switch the variable: increase reps, change tempo, shorten rest periods, or add a set. Your muscles respond to novelty, not just load.

### 2. Periodization Reset
If you've been in a building phase for more than 8–10 weeks, your nervous system is likely undertrained. A planned deload week (50% volume, full intensity) often produces a jump in performance the following week.

### 3. Recovery Audit
Plateaus are often not a training problem — they're a recovery problem. An extra 45 minutes of sleep per night has been shown to improve reaction time and strength output by 5–8%. Track your HRV for two weeks and see what the data tells you.

## The FitFlow Approach

Our adaptive training algorithm detects plateau patterns before they become frustrating. When your performance curve flattens for more than two sessions, your coach gets an alert and reviews your plan. No waiting weeks to figure out what went wrong.

The plateau isn't the enemy. Staying in the same program when your body is begging for change — that's the enemy.`,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    tags: ['training', 'performance', 'coaching'],
    author: 'Coach Alex Mercer',
    readTime: 5,
  },
  {
    title: 'The Macros Nobody Talks About: Micronutrients for Athletic Performance',
    slug: 'micronutrients-athletic-performance',
    excerpt: 'You\'ve dialed in your protein and carbs. But are you missing the micronutrients that actually power performance at the cellular level?',
    body: `# The Macros Nobody Talks About: Micronutrients for Athletic Performance

Protein. Carbohydrates. Fat. These are the three conversations that dominate sports nutrition — and rightly so. But ask most athletes about their iron levels, their magnesium intake, or their Vitamin D status, and you'll get a blank stare.

Here's the thing: **your macros can't do their job without the right micronutrients in place**.

## The Big Three Micronutrient Gaps in Athletes

### Iron
Iron deficiency is the most common nutritional deficiency worldwide, and athletes — especially female athletes and endurance runners — are at significantly higher risk. Low iron = low hemoglobin = less oxygen delivered to muscles = worse performance.

*Signs you might be low:* Unexplained fatigue, elevated heart rate at easy paces, irritability, brain fog.

*Best sources:* Red meat, lentils, spinach (with Vitamin C to improve absorption), fortified cereals.

### Magnesium
Magnesium is involved in over 300 enzymatic reactions in the body, including muscle contraction and protein synthesis. Sweat-heavy athletes lose significant amounts daily.

*Signs you might be low:* Muscle cramps, poor sleep, anxiety, constipation.

*Best sources:* Dark leafy greens, pumpkin seeds, dark chocolate, legumes.

### Vitamin D
Despite the name, Vitamin D is actually a hormone — and it regulates immune function, bone density, and muscle protein synthesis. The majority of people in northern latitudes are deficient.

*Signs you might be low:* Frequent illness, stress fractures, low mood, slow recovery.

*Best sources:* Sunlight (20 min/day), fatty fish, egg yolks, and often supplementation is necessary.

## Getting a Baseline

The most important thing you can do this month is get bloodwork done. A standard panel should include ferritin, magnesium (RBC, not serum), Vitamin D (25-OH), and zinc. FitFlow's Elite coaches review your nutrition labs and adjust your meal plan accordingly.

Don't let macro precision mask micronutrient chaos.`,
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    tags: ['nutrition', 'performance', 'health'],
    author: 'Dr. Sasha Kim, RD',
    readTime: 7,
  },
  {
    title: 'HRV: The One Number That Tells You How Ready You Are',
    slug: 'hrv-training-readiness',
    excerpt: 'Heart Rate Variability is the most powerful signal in sports science right now. Here\'s how to read it, track it, and use it to stop training on empty.',
    body: `# HRV: The One Number That Tells You How Ready You Are

Heart Rate Variability. Three words that were once confined to elite sport physiology labs are now on the wrist of every serious athlete. But most people tracking HRV don't really understand what they're looking at.

Let's fix that.

## What HRV Actually Is

Your heart doesn't beat like a metronome. The time between beats varies slightly — sometimes 850ms, then 823ms, then 877ms. This variation is controlled by your autonomic nervous system. **High variability = your nervous system is balanced and ready. Low variability = your body is under stress and not recovered.**

HRV is not a single measurement — it's a trend. What matters is your personal baseline and how today's reading compares to it.

## How to Use HRV Practically

**Green (>95% of your rolling average):** Train hard. This is a day to push.

**Yellow (85–95%):** Moderate intensity. Technique work, aerobic base, or recovery sessions.

**Red (<85%):** Active recovery or rest. A hard session today will cost you more than it gives you.

The mistake most athletes make is ignoring red days because they feel "fine." Your subjective feeling is 24 hours behind your nervous system. Trust the data.

## Common HRV Killers

- Alcohol (even one drink can suppress HRV for 2–3 days)
- Inadequate sleep (below 7 hours)
- High psychological stress
- Under-fueling before hard sessions
- Overtraining without periodization

## FitFlow's Recovery Score

FitFlow's Recovery Score combines HRV with your sleep duration, sleep quality, resting heart rate, and self-reported feel to produce a single daily readiness number. Your training plan automatically adjusts based on it. If you're red, your sessions scale back — automatically.

Your body is always telling you what it needs. HRV is just finally making that conversation legible.`,
    coverImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
    tags: ['recovery', 'analytics', 'health'],
    author: 'Coach James Okafor',
    readTime: 6,
  },
  {
    title: 'How to Choose a Fitness Coach (Without Getting Burned)',
    slug: 'how-to-choose-fitness-coach',
    excerpt: 'The fitness industry is flooded with self-proclaimed coaches. Here\'s the 7-point checklist that separates the real ones from the Instagram-certified fakes.',
    body: `# How to Choose a Fitness Coach (Without Getting Burned)

There are more people calling themselves fitness coaches today than at any point in history. Most have a social media following. Some have a certification bought in a weekend. A few are genuinely excellent. Knowing the difference matters.

## The 7-Point Checklist

### 1. Verifiable Credentials
Look for NSCA-CSCS, NASM-CPT, ACSM, or equivalent national certifications. These require demonstrated knowledge and continuing education. Ask for their cert number and verify it.

### 2. Specialization Match
A powerlifting coach building marathon training plans is a red flag. Find someone whose experience aligns with your specific goals. Ask for examples of clients with similar backgrounds.

### 3. Data-Driven Methodology
Good coaches track. They want to see your metrics, they ask about your sleep, they adjust based on performance trends — not just "how you feel."

### 4. Communication Clarity
In your first call, do they explain *why* they program what they program? Can they translate physiology into plain language? Coaches who speak only in jargon often don't understand their own programs.

### 5. Realistic Expectations
Be suspicious of any coach who promises specific results in specific timeframes. Good coaches give ranges, discuss variables, and set process goals — not just outcome goals.

### 6. References You Can Actually Call
Not testimonials on their website. Real clients willing to have a conversation with you. If they can't provide two or three, keep looking.

### 7. A Clear Programming Philosophy
Ask them: "What's your approach when a client plateaus?" Their answer will tell you everything about how they think.

## Why Platform Matters

On FitFlow, every coach is vetted through a 4-step process: credential verification, background check, a practical programming assessment, and a trial period with supervised clients. You can read verified reviews, see their specializations, and message them before committing.

The right coach changes everything. The wrong one costs you time, money, and momentum.`,
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    tags: ['coaching', 'guide', 'getting-started'],
    author: 'FitFlow Team',
    readTime: 6,
  },
  {
    title: 'The 80/20 Rule in Training: Why Most Athletes Have It Backwards',
    slug: '80-20-training-rule',
    excerpt: 'Elite endurance athletes train at low intensity 80% of the time. Most recreational athletes flip that ratio — and wonder why they\'re always injured and burned out.',
    body: `# The 80/20 Rule in Training: Why Most Athletes Have It Backwards

Study elite marathoners, pro cyclists, or Olympic rowers and you'll find a consistent pattern in their training: **about 80% of their sessions are done at low intensity, and only 20% at high intensity.**

Now look at most recreational athletes. They go moderate-hard on almost every session — the "gray zone" that's too easy to drive real adaptation and too hard to recover from quickly.

## Why the Gray Zone is a Trap

The gray zone (roughly 75–85% max heart rate for most people) *feels* productive. You're breathing hard, you're sweating, you feel like you're "working." But physiologically, it's the worst of both worlds:

- Too intense to fully recruit your aerobic energy system
- Too moderate to create the neuromuscular adaptation of true high-intensity work
- Too hard to recover from quickly, so it limits your total training volume

## What Polarized Training Looks Like

**80% Zone 1-2 (easy):** Conversational pace. Nasal breathing. You could hold a full conversation. This builds aerobic base, improves fat oxidation, and is recoverable in 24 hours.

**20% Zone 4-5 (hard):** Intervals at or above lactate threshold. Truly uncomfortable. Complete recovery required before next hard session.

The missing piece? Zone 3 (moderate) should make up less than 5% of your total training.

## Making the Shift

The hardest part of 80/20 training for most athletes is slowing down. Easy runs *feel* embarrassingly slow at first. Ride with your ego on a leash for 8–12 weeks. Your aerobic engine will grow, and then your hard sessions will be harder than ever before.

FitFlow's training plans are built on this polarized model by default. Your easy sessions are calibrated to your actual Zone 2 threshold — not a generic heart rate formula.

Train easy more. Train hard less. Get faster anyway. This is the counterintuitive truth that changes everything.`,
    coverImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    tags: ['training', 'endurance', 'performance'],
    author: 'Coach Alex Mercer',
    readTime: 8,
  },
  {
    title: 'Building Your First 12-Week Strength Program: A Complete Guide',
    slug: 'first-12-week-strength-program',
    excerpt: 'Everything you need to build real, lasting strength from scratch — with a week-by-week framework, exercise selection logic, and the mistakes to avoid.',
    body: `# Building Your First 12-Week Strength Program: A Complete Guide

If you've been training inconsistently, following random YouTube workouts, or stuck on the same program for years — this guide is for you. We're going to build a 12-week strength program from the ground up.

## The Principles First

Before we touch sets and reps, understand these four principles that make any strength program work:

**Specificity:** Train for what you want. Strength requires lifting heavy. Endurance requires volume. Define your goal first.

**Progressive Overload:** Your body adapts to the stimulus you give it. Each week must be slightly harder than the last. This can be more weight, more reps, less rest, or better form.

**Recovery:** Strength is built in the recovery window, not in the gym. You tear muscle fiber by lifting. You rebuild stronger fiber while sleeping and eating.

**Consistency:** A mediocre program done consistently beats a perfect program done sporadically. Show up.

## The Structure: 3 Phases of 4 Weeks

### Phase 1 (Weeks 1-4): Foundation
- Focus: Movement quality, building the habit, establishing baseline lifts
- Frequency: 3 days/week full body
- Intensity: 65–70% of 1RM
- Key lifts: Squat, deadlift, bench press, row (learn these patterns first)

### Phase 2 (Weeks 5-8): Accumulation
- Focus: Adding volume, increasing intensity
- Frequency: 4 days/week upper/lower split
- Intensity: 70–80% of 1RM
- Introduce: Romanian deadlifts, Bulgarian split squats, overhead press

### Phase 3 (Weeks 9-12): Intensification
- Focus: Peaking strength, heavy singles/doubles
- Frequency: 4 days/week with dedicated heavy days
- Intensity: 80–90% of 1RM
- Test your 1RMs in Week 12

## Nutrition for Strength

You cannot build strength in a caloric deficit. At minimum, eat at maintenance. Ideally, eat at a 200–300 calorie surplus with 1.6–2.2g protein per kilogram of bodyweight.

## Track Everything

Log every session: weight, reps, how it felt. Without data, you're guessing. FitFlow's workout logger makes this fast and shows you your progression curves automatically.

The 12 weeks will pass regardless. Make them count.`,
    coverImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
    tags: ['strength', 'training', 'getting-started', 'guide'],
    author: 'Coach Marcus Rivera',
    readTime: 9,
  },
];

const seed = async () => {
  await connectDB();

  try {
    console.log('🌱 Starting seed...');

    // Clear existing data (idempotent)
    await Promise.all([
      Feature.deleteMany({}),
      Pricing.deleteMany({}),
      Post.deleteMany({}),
    ]);

    // Seed features, pricing, posts in parallel
    const [seededFeatures, seededPricing, seededPosts] = await Promise.all([
      Feature.insertMany(features),
      Pricing.insertMany(pricing),
      Post.insertMany(posts),
    ]);

    console.log(`✅ ${seededFeatures.length} features seeded`);
    console.log(`✅ ${seededPricing.length} pricing plans seeded`);
    console.log(`✅ ${seededPosts.length} blog posts seeded`);

    // Create demo user if not exists
    const existingUser = await User.findOne({ email: 'demo@fitflow.com' });
    if (!existingUser) {
      await User.create({
        name: 'Demo Athlete',
        email: 'demo@fitflow.com',
        password: 'FitFlow2024!',
        role: 'user',
        plan: 'pro',
        bio: 'Marathon runner, CrossFit enthusiast, and data nerd.',
        fitnessGoal: 'Sub-3 hour marathon by Q4 2024',
      });
      console.log('✅ Demo user created — email: demo@fitflow.com, password: FitFlow2024!');
    } else {
      console.log('ℹ️  Demo user already exists, skipping');
    }

    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
