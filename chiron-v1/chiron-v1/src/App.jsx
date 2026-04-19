import { useState, useEffect, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg: '#0C0B09', surface: '#161310', surfaceEl: '#1E1A15',
  accent: '#C9A84C', accentDim: 'rgba(201,168,76,0.12)',
  text: '#F2EDE4', textMuted: '#8A8070', textFaint: '#524A3F',
  border: '#252018', borderLight: '#302A20', green: '#4CAF72',
};

const PRICES = { single: 27, bundle: 57 };
const FREE_PHIL_LIMIT = 3;

// ─── MODULE DATA ──────────────────────────────────────────────────────────────
const MODULES = [
  {
    id: 1, free: true, tag: "Foundation", duration: "12 min",
    title: "Why Most Businesses Fail at Advertising",
    subtitle: "The hard truths nobody tells you",
    content: {
      intro: "Most businesses don't fail because of bad products. They fail because they treat advertising like a slot machine — put money in, hope something comes out. That's not a strategy. That's a prayer.",
      sections: [
        { heading: "The Attention Economy", body: "Your customer sees thousands of ads every single day. Most of them are invisible. The question isn't 'how do I run an ad?' — it's 'why would anyone stop for mine?' If you can't answer that clearly and quickly, you're not ready to spend a dollar on media." },
        { heading: "The Three Reasons Ads Fail", body: "Wrong audience. Wrong message. Wrong timing. It's almost always one of these three. Businesses pour budget into creative when their targeting is broken. Or they nail the audience but the offer is weak. Or they show up at the wrong moment in the buying journey. Every underperforming campaign traces back to one of these — and usually the operator already knew which one." },
        { heading: "The Shift That Changes Everything", body: "Stop thinking about what you want to say. Start thinking about what your customer needs to hear. Advertising isn't about you — it's about them. Their problem. Their fear. Their desire. The moment you make that shift, everything downstream gets easier: the copy, the targeting, the offer, the creative." }
      ]
    }
  },
  {
    id: 2, free: true, tag: "Strategy", duration: "15 min",
    title: "Building Your Marketing Foundation",
    subtitle: "Position before you spend",
    content: {
      intro: "Everyone wants to skip to the ad spend. Nobody wants to do the boring foundational work first. But without a foundation, you're building on sand. And sand doesn't scale.",
      sections: [
        { heading: "Who Is Your Customer, Really?", body: "'Women 25–54 who like fitness' is a demographic. Your customer is someone specific — with a specific problem, a specific fear, and a specific desire. That depth of specificity is what makes copy land and ads convert. Generic audiences get generic results. The more precisely you can articulate who your customer is — what keeps them up at night, what they've already tried, what they're embarrassed to admit — the better every downstream decision becomes." },
        { heading: "Positioning Before Spending", body: "What do you do, for whom, and why should they believe you over everyone else? If you can't answer all three in under 10 seconds, your ads will always underperform — not because of the platform or the targeting, but because the message has no anchor. Positioning isn't a tagline. It's a strategic decision about where you stand in the market and what makes that position defensible." },
        { heading: "Goals That Actually Mean Something", body: "'Increase revenue' is not a goal. 'Acquire 50 new customers this quarter at under $40 cost per acquisition' is a goal. Specific, measurable, and tied directly to what the business needs to survive and grow. Without a clear goal with a number attached to it, you have no way to evaluate whether any campaign is working — and no basis for making smart decisions about where to spend next." }
      ]
    }
  },
  {
    id: 3, free: false, tag: "Paid Media", duration: "20 min",
    title: "Paid Social — Meta & Instagram",
    subtitle: "Where most businesses actually live",
    content: {
      intro: "Meta's advertising ecosystem — Facebook and Instagram combined — remains the most powerful self-serve paid media platform available to small and mid-sized businesses. Understanding how it works, and how to work it effectively, is non-negotiable for any business running paid advertising today.",
      sections: [
        { heading: "How Meta's Algorithm Actually Works", body: "Meta operates an auction — but it's not purely about who bids the most. The platform scores every ad on three dimensions: bid amount, estimated action rate (how likely a user is to take the action you want), and ad quality. The winner of the auction isn't the highest bidder; it's the ad with the highest total value score. This is why a well-crafted ad with a modest budget can outperform a bloated campaign with poor creative. The algorithm rewards relevance. Your job is to give it exactly that." },
        { heading: "Campaign Structure That Scales", body: "Meta campaigns have three levels: campaign (objective), ad set (audience and budget), and ad (creative). The most common mistake is over-complicating the structure — too many ad sets, too many audiences, too little data per decision point. For most businesses starting out, one campaign per objective, two to three ad sets testing different audiences, and two to three creatives per ad set is enough to generate meaningful signal without fragmenting your budget. Keep it simple until the data tells you to expand." },
        { heading: "Audience Strategy: Cold, Warm, and Hot", body: "Not all audiences are equal, and your messaging should reflect where someone is in their relationship with your brand. Cold audiences have never heard of you — they need problem-aware messaging that earns attention. Warm audiences have engaged with your content or visited your site — they need proof, specificity, and a reason to act. Hot audiences have already converted or are close to it — they need retention, upsell, or a final nudge. Running the same ad to all three tiers is one of the most expensive mistakes a business can make." },
        { heading: "Creative: The Dominant Variable", body: "In the current Meta environment, creative is the most important lever you control. Targeting has become increasingly automated — the algorithm is better at finding your audience than most humans are at building one. What the algorithm can't do is make your ad interesting. Hook in the first two seconds. Lead with the problem or outcome, not your brand. Use native-feeling formats — UGC-style video, raw testimonials, and pattern-disrupting static images consistently outperform polished production in most categories. Test relentlessly, kill losers fast, and scale winners without changing what's working." },
        { heading: "Measurement and Iteration", body: "Meta's default attribution window is 7-day click and 1-day view. Understand what that means before drawing conclusions: some of those attributed conversions would have happened anyway through other channels. Use a blended approach — compare Meta's reported results against your actual business outcomes like total revenue and new customer count. Set a weekly review cadence. Track cost per result trends, watch for creative fatigue as frequency climbs, and monitor audience saturation in smaller markets. The businesses that win on Meta are the ones that show up consistently and iterate deliberately." }
      ]
    }
  },
  {
    id: 4, free: false, tag: "Paid Media", duration: "18 min",
    title: "Google Ads — Search & Display",
    subtitle: "Capture intent, not just attention",
    content: {
      intro: "Google Ads operates on a fundamentally different principle than social advertising. On Meta, you interrupt people who weren't thinking about you. On Google Search, you show up for people who are already looking. That distinction shapes everything — the strategy, the creative, the bidding, and what success looks like.",
      sections: [
        { heading: "Search vs. Display: Two Different Games", body: "Search ads appear when someone types a query into Google — they capture intent, the user has already raised their hand. Display ads appear across Google's network of partner websites, apps, and YouTube, functioning more like social ads: interruption-based, awareness-driven, audience-targeted. Both have a place in a full-funnel strategy, but they require entirely different creative approaches and performance expectations. Search drives direct conversions. Display builds presence. Confusing the two is a fast way to waste budget." },
        { heading: "Keyword Strategy: Match Types and Intent Signals", body: "Keywords are the foundation of Search campaigns, and match type determines how closely a user's query must align with your keyword before your ad shows. Broad match casts the widest net and relies heavily on Google's AI to determine relevance. Phrase match requires the query to contain your keyword's meaning in sequence. Exact match triggers only on near-identical queries. Most campaigns should start with phrase and exact match, introducing broad match carefully once there's conversion data to guide the algorithm. Equally important is building a negative keyword list from day one." },
        { heading: "Quality Score and Ad Rank", body: "Google's auction isn't won by the highest bidder alone. Ad Rank is determined by your bid multiplied by Quality Score plus the expected impact of ad extensions. Quality Score itself is a composite of expected click-through rate, ad relevance to the keyword, and landing page experience. A high Quality Score lowers your cost per click and improves your ad position — meaning better placement for less spend. Every element in the chain should speak directly to what the user was searching for." },
        { heading: "Bidding Strategies and Budget Allocation", body: "Google's automated bidding strategies — Target CPA, Target ROAS, Maximize Conversions, and Maximize Clicks among them — rely on conversion data to optimize effectively. New accounts with little conversion history should start with Maximize Clicks or manual CPC to accumulate that data before switching to value-based or CPA-based bidding. Switching too early gives the algorithm too little signal to work with and typically results in wasted spend. Budget allocation should follow performance: Search campaigns converting profitably deserve the majority of budget." },
        { heading: "Display, Remarketing, and the Full Picture", body: "Remarketing is where Google Ads extends beyond pure intent capture and often delivers the highest ROI in the account. It allows you to serve ads specifically to people who have already visited your site, watched your video, or interacted with your app — audiences that convert at dramatically higher rates because they already have context about your brand. A well-structured remarketing campaign is one of the highest-return activities available to any business with existing web traffic." }
      ]
    }
  },
  {
    id: 5, free: false, tag: "Advanced", duration: "22 min",
    title: "CTV & Streaming Advertising",
    subtitle: "The channel most agencies are sleeping on",
    content: {
      intro: "Connected TV — advertising delivered through streaming platforms on internet-connected televisions — is no longer an emerging channel. It is where attention has moved, and for businesses willing to get there early, it represents a meaningful competitive advantage. Streaming now accounts for nearly half of all US television viewing time, yet most small and mid-sized businesses haven't touched it.",
      sections: [
        { heading: "What CTV Actually Is", body: "Connected TV refers to any television set connected to the internet — smart TVs, streaming sticks, gaming consoles, and set-top boxes. CTV advertising delivers ads through streaming apps: Hulu, Peacock, Tubi, Pluto TV, Amazon Prime Video, and dozens of others. Unlike traditional broadcast TV, CTV ads are targeted at the household level using digital data — meaning you can reach specific audience segments with the precision of digital advertising, delivered on the largest screen in the home. Completion rates for CTV ads typically run between 90 and 98%, compared to under 60% for most pre-roll digital video formats." },
        { heading: "Why It's Underutilized — and Why That's Your Opportunity", body: "Most small businesses assume CTV is out of reach — a channel for national brands with seven-figure budgets. That was true five years ago. Self-serve platforms like MNTN, StackAdapt, and The Trade Desk now allow businesses to launch CTV campaigns starting around $500 per month. The businesses that establish brand presence on streaming now — while most competitors still fight over the same saturated Meta and Google inventory — will carry a meaningful advantage in consumer recall and brand trust." },
        { heading: "Targeting on CTV", body: "CTV targeting combines the precision of digital with the reach of television. You can target by geography down to the zip code level, by household income bracket, by purchase behavior, by interest category, and by first-party data such as your own customer list. Retargeting is also available — serving CTV ads to households where someone has previously visited your website. This cross-device coordination creates a frequency and brand recall effect that single-channel campaigns cannot replicate." },
        { heading: "Creative Requirements for CTV", body: "CTV ads are non-skippable in most placements, which fundamentally changes the creative contract. You don't need to hook in the first two seconds the way you do on social — you have the viewer's full attention for 15 or 30 seconds. Open with a relatable problem or scenario, deliver your value proposition clearly in the middle, and close with a strong brand moment and a simple call to action. Since viewers can't click from their television, the CTA should direct them to a memorable URL or promo code they can act on later." },
        { heading: "Measurement and Attribution", body: "CTV attribution is the most commonly cited barrier for businesses considering the channel — and it's a legitimate challenge. Modern CTV platforms address this through household IP matching, which connects ad exposure to downstream website visits and conversions with reasonable accuracy. Lift studies — comparing conversion behavior in exposed versus unexposed households — provide an additional measurement layer. The honest framing: CTV performs best when evaluated as a brand-building investment with measurable downstream effects on performance channels like paid search and paid social. Waiting for perfect attribution means waiting indefinitely." }
      ]
    }
  },
  {
    id: 6, free: false, tag: "Advanced", duration: "24 min",
    title: "Full-Funnel Scaling",
    subtitle: "How it all connects",
    content: {
      intro: "Every channel covered in this curriculum can produce results in isolation. But the businesses that scale — and sustain that scale over time — are the ones that understand how channels work together across the entire customer journey. A full-funnel strategy isn't about running everything at once. It's about building a system where each stage feeds the next.",
      sections: [
        { heading: "The Funnel Is Not a Metaphor — It's a Math Problem", body: "At its core, a marketing funnel is a conversion rate problem. A defined number of people become aware of your business. A percentage consider your offer. A percentage convert. A percentage become repeat buyers. Every scaling decision should be grounded in this math. Where is the biggest drop-off? Is awareness too low, or is conversion the bottleneck? Is retention weak, making acquisition costs unsustainable? You cannot fix a funnel you haven't mapped and measured. Start there before spending another dollar on any channel." },
        { heading: "Top of Funnel: Building Awareness at Scale", body: "Top-of-funnel activity — CTV, display, broad social, organic content — exists to introduce your brand to people who don't know you exist. The primary metric here is not conversion; it's reach, recall, and the size of the audience flowing into the consideration stage. Businesses that skip the top of funnel and run only direct-response campaigns are harvesting existing demand without replenishing it. That strategy works until the audience is exhausted — and when it stops working, it stops fast." },
        { heading: "Middle of Funnel: Earning Consideration", body: "The middle of the funnel is where most businesses underinvest, and where most deals are actually won or lost. This is where prospects who know you exist decide whether to trust you enough to act. Retargeting campaigns, email nurture sequences, testimonials, case studies, and detailed content all belong here. The job of mid-funnel is to reduce friction and build proof. Answer the objections before they're raised. Skipping this stage forces your bottom-funnel campaigns to carry weight they were never designed to handle." },
        { heading: "Bottom of Funnel: Converting With Precision", body: "Bottom-of-funnel campaigns target people who are close to a decision — warm website visitors, email subscribers who've engaged repeatedly, people who have added to cart without purchasing, or existing customers ready for a complementary offer. Search ads, direct-response retargeting, and personalized email are the primary tools. Messaging should be specific, offer-focused, and urgency-aware where appropriate. Landing page optimization belongs here too: a 1% improvement in conversion rate delivers the same revenue impact as a 100% increase in traffic." },
        { heading: "Retention: The Multiplier Most Businesses Ignore", body: "Acquiring a new customer costs five to seven times more than retaining an existing one — yet most marketing budgets are allocated almost entirely to acquisition. The businesses that scale with healthy margins treat retention as a core growth strategy, not an afterthought. Email sequences for existing customers, loyalty structures, re-engagement campaigns, and proactive service all drive repeat revenue. Increasing customer lifetime value by 20% through better retention produces the same profit improvement as growing new customer acquisition by 20% — at a significantly lower cost." }
      ]
    }
  }
];

const PHIL_SYSTEM = `You are Chiron, an elite business strategist and marketing mentor. You go by "Phil" — a nod to the legendary gruff trainer from Disney's Hercules who shaped heroes. You've guided hundreds of businesses through growth, failure, and reinvention.

Personality: Direct, experienced, slightly gruff — but genuinely invested in the user's success. Don't sugarcoat. Occasionally open with "Look, kid..." or "I've seen this a thousand times..." Deep expertise in Meta Ads, Google Ads, CTV/streaming, brand positioning, full-funnel strategy, scaling businesses.

Keep responses tight — 2 to 4 sentences. Direct. Memorable. Sound like someone who's been in the trenches. Be Phil.`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ls = {
  get: (k, fb = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isMobile = () => /mobile|android/i.test(navigator.userAgent) || isIOS();
const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Chiron() {
  const [view, setView] = useState('home');
  const [activeModule, setActiveModule] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [unlocked, setUnlocked] = useState([]);
  const [philCount, setPhilCount] = useState(0);
  const [hasFullPhil, setHasFullPhil] = useState(false);

  // modals
  const [showGate, setShowGate] = useState(false);
  const [gateStep, setGateStep] = useState('form'); // 'form' | 'success'
  const [showPricing, setShowPricing] = useState(false);
  const [pendingModule, setPendingModule] = useState(null);
  const [showPhilGate, setShowPhilGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // PWA install
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showIOSInstall, setShowIOSInstall] = useState(false);

  // chat
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Name's Chiron. Some people call me Phil. I've trained more businesses than I care to count — and I'm here to make sure yours is one that actually makes it. What do you need?" }
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEnd = useRef(null);

  // ── Bootstrap ──
  useEffect(() => {
    const sid = 'chiron-global';
    if (!document.getElementById(sid)) {
      const s = document.createElement('style');
      s.id = sid;
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        html{-webkit-text-size-adjust:100%}
        .ch-card{transition:all 0.22s ease}
        .ch-card:hover{border-color:#C9A84C!important;transform:translateY(-3px)!important;box-shadow:0 12px 40px rgba(0,0,0,0.4)!important}
        .ch-nl:hover{color:#C9A84C!important}
        .ch-fade{animation:chF 0.55s ease forwards;opacity:0}
        .d1{animation-delay:.05s}.d2{animation-delay:.18s}.d3{animation-delay:.32s}.d4{animation-delay:.46s}.d5{animation-delay:.6s}
        @keyframes chF{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes chS{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes chP{0%,100%{opacity:1}50%{opacity:.35}}
        .ch-slide{animation:chS 0.28s ease forwards}
        .ch-pulse{animation:chP 1.2s infinite}
        input.chi::placeholder{color:#524A3F}
        input.chi:focus{outline:none;border-color:#C9A84C!important}
        input.chi{-webkit-appearance:none;appearance:none}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#161310}::-webkit-scrollbar-thumb{background:#302A20;border-radius:2px}
        .ch-ghost:hover{background:rgba(201,168,76,0.07)!important}
        .ch-next:hover{border-color:#C9A84C!important}
        .ch-tier:hover{border-color:#C9A84C!important;background:#1E1A15!important}
        .ch-ios-arrow{animation:bounce 1.5s infinite}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .ch-hero { padding: 48px 20px 48px !important; }
          .ch-hero-btns { flex-direction: column !important; }
          .ch-hero-btns button { width: 100% !important; }
          .ch-phil-quote { padding: 18px 20px !important; }
          .ch-stats { gap: 28px !important; padding: 32px 20px !important; }
          .ch-curriculum { padding: 0 16px 48px !important; }
          .ch-footer { justify-content: center !important; text-align: center !important; }
          .ch-module-grid { grid-template-columns: 1fr !important; }
          .ch-bundle { flex-direction: column !important; align-items: flex-start !important; }
          .ch-bundle button { width: 100% !important; }
          .ch-cta-section { padding: 40px 20px !important; }
          .ch-card:hover { transform: none !important; }
          .ch-module-content { padding: 36px 18px 100px !important; }
          .ch-acadia-cta { padding: 22px 22px !important; }
          .ch-next-module { width: 100% !important; max-width: 100% !important; }
          .ch-nav { padding: 14px 18px !important; }
          .ch-section-divider { margin-bottom: 48px !important; }
        }

        /* ── Safe area (iPhone notch/home bar) ── */
        .ch-chat-btn {
          bottom: calc(20px + env(safe-area-inset-bottom)) !important;
        }
        .ch-chat-window {
          bottom: calc(88px + env(safe-area-inset-bottom)) !important;
        }
        nav {
          padding-top: max(14px, env(safe-area-inset-top));
        }
      `;
      document.head.appendChild(s);
    }

    // Load persisted state
    setIsRegistered(!!ls.get('chiron_email'));
    setUnlocked(ls.get('chiron_unlocked', []));
    setPhilCount(ls.get('chiron_phil_count', 0));
    setHasFullPhil(ls.get('chiron_full_phil', false));

    // Handle Stripe success redirect (?session_id=xxx)
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      setVerifying(true);
      window.history.replaceState({}, '', '/'); // clean URL immediately
      fetch(`/api/verify-purchase?session_id=${sessionId}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            const newUnlocked = data.unlocked;
            ls.set('chiron_unlocked', newUnlocked);
            ls.set('chiron_full_phil', true);
            setUnlocked(newUnlocked);
            setHasFullPhil(true);
            setShowPurchaseSuccess(true);
          }
        })
        .catch(err => console.error('Verify error:', err))
        .finally(() => setVerifying(false));
    }

    // Catch Android install prompt
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const ff = "'Playfair Display', Georgia, serif";
  const sf = "'DM Sans', system-ui, sans-serif";

  // ── Access helpers ──
  const isModuleUnlocked = (mod) => mod.free || unlocked === 'all' || (Array.isArray(unlocked) && unlocked.includes(mod.id));
  const philRemaining = Math.max(0, FREE_PHIL_LIMIT - philCount);
  const canUsePhil = hasFullPhil || philRemaining > 0;

  // ── Navigation ──
  const goHome = () => { setView('home'); setActiveModule(null); };

  const openModule = (mod) => {
    if (!isRegistered) { setPendingModule(mod); setShowGate(true); setGateStep('form'); return; }
    if (!isModuleUnlocked(mod)) { setPendingModule(mod); setShowPricing(true); return; }
    setActiveModule(mod); setView('module');
  };

  // ── PWA install trigger ──
  const triggerInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') setInstallPrompt(null);
    } else if (isIOS()) {
      setShowIOSInstall(true);
    }
  };

  // ── Registration + Mailchimp ──
  const handleRegister = async () => {
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || 'Something went wrong. Try again.');
        setSubmitting(false);
        return;
      }

      // Success — persist locally and advance to success step
      ls.set('chiron_email', email);
      setIsRegistered(true);
      setGateStep('success');
      setEmail('');
    } catch {
      setEmailError('Connection error. Try again.');
    }
    setSubmitting(false);
  };

  const handleGateSuccess = () => {
    setShowGate(false);
    setGateStep('form');
    if (pendingModule) {
      if (isModuleUnlocked(pendingModule)) {
        setActiveModule(pendingModule); setView('module');
      } else {
        setShowPricing(true);
      }
      setPendingModule(null);
    }
  };

  // ── Purchase — Stripe Checkout ──
  const purchaseModule = async (mod) => {
    if (purchaseLoading) return;
    setPurchaseLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'module',
          moduleId: mod.id,
          email: ls.get('chiron_email') || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else console.error('No checkout URL returned');
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setPurchaseLoading(false);
  };

  const purchaseBundle = async () => {
    if (purchaseLoading) return;
    setPurchaseLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bundle',
          email: ls.get('chiron_email') || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else console.error('No checkout URL returned');
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setPurchaseLoading(false);
  };

  // ── Phil chat ──
  const openPhilChat = () => {
    if (!canUsePhil) { setShowPhilGate(true); return; }
    setShowChat(true);
  };

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    if (!hasFullPhil && philCount >= FREE_PHIL_LIMIT) { setShowPhilGate(true); return; }

    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(''); setChatLoading(true);

    if (!hasFullPhil) {
      const next = philCount + 1;
      setPhilCount(next);
      ls.set('chiron_phil_count', next);
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system: PHIL_SYSTEM + (activeModule ? `\n\nUser is on Module ${activeModule.id}: "${activeModule.title}".` : ''),
          messages: updated.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const d = await res.json();
      setMessages(p => [...p, { role: 'assistant', content: d.content?.[0]?.text || "Give me a second, kid." }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: "Something went sideways. Try again." }]);
    }
    setChatLoading(false);
  };

  // ── Small components ──
  const Tag = ({ children }) => (
    <span style={{ display: 'inline-block', background: C.accentDim, color: C.accent, fontSize: '10px', fontWeight: '600', letterSpacing: '0.18em', padding: '3px 10px', borderRadius: '2px', textTransform: 'uppercase' }}>{children}</span>
  );

  const ModuleStatus = ({ mod }) => {
    if (mod.free) return <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '2px', background: C.accentDim, color: C.accent }}>FREE</span>;
    if (isModuleUnlocked(mod)) return <span style={{ fontSize: '10px', fontWeight: '600', padding: '4px 10px', borderRadius: '2px', background: 'rgba(76,175,114,0.15)', color: C.green }}>✓ OWNED</span>;
    return <span style={{ fontSize: '10px', fontWeight: '600', padding: '4px 10px', borderRadius: '2px', background: C.border, color: C.textMuted }}>${PRICES.single}</span>;
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: sf, color: C.text }}>

      {/* ── iOS Install Banner ── */}
      {showIOSInstall && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', zIndex: 150 }}>
          <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.5' }}>
            <span style={{ fontWeight: '600' }}>Add Chiron to your Home Screen</span><br />
            <span style={{ color: C.textMuted }}>Tap <strong>Share</strong> <span className="ch-ios-arrow" style={{ display: 'inline-block' }}>⬆</span> then <strong>Add to Home Screen</strong></span>
          </div>
          <span onClick={() => setShowIOSInstall(false)} style={{ color: C.textMuted, cursor: 'pointer', fontSize: '20px', flexShrink: 0 }}>×</span>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className="ch-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: showIOSInstall ? '52px' : 0, background: 'rgba(12,11,9,0.97)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div onClick={goHome} style={{ fontFamily: ff, fontSize: '19px', fontWeight: '700', color: C.accent, letterSpacing: '0.12em', cursor: 'pointer' }}>CHIRON</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span className="ch-nl" onClick={openPhilChat} style={{ color: C.textMuted, fontSize: '12px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}>
            Phil {!hasFullPhil && isRegistered && <span style={{ color: C.accent }}>({philRemaining})</span>}
          </span>
          {!isRegistered
            ? <button onClick={() => { setShowGate(true); setGateStep('form'); }} style={{ background: C.accent, color: '#0C0B09', border: 'none', padding: '8px 18px', borderRadius: '3px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}>Start Free</button>
            : unlocked === 'all'
              ? <span style={{ color: C.green, fontSize: '12px', fontWeight: '600' }}>✓ Full Access</span>
              : <button onClick={() => setShowPricing(true)} style={{ background: 'transparent', color: C.accent, border: `1px solid ${C.accent}`, padding: '8px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}>Unlock</button>
          }
        </div>
      </nav>

      {/* ── MODULE VIEW ── */}
      {view === 'module' && activeModule ? (
        <div className="ch-module-content" style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 120px' }}>
          <div onClick={goHome} style={{ color: C.accent, fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginBottom: '36px' }}>← Curriculum</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <Tag>{activeModule.tag}</Tag>
            <span style={{ color: C.textMuted, fontSize: '13px' }}>· {activeModule.duration}</span>
          </div>
          <h1 style={{ fontFamily: ff, fontSize: 'clamp(24px,4vw,40px)', fontWeight: '700', lineHeight: '1.18', marginBottom: '10px' }}>{activeModule.title}</h1>
          <p style={{ color: C.textMuted, fontSize: '15px', marginBottom: '40px', fontWeight: '300' }}>{activeModule.subtitle}</p>
          {activeModule.content.intro && (
            <p style={{ fontSize: '16px', lineHeight: '1.85', color: C.textMuted, borderLeft: `3px solid ${C.accent}`, paddingLeft: '20px', marginBottom: '48px', fontWeight: '300' }}>{activeModule.content.intro}</p>
          )}
          {activeModule.content.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: '44px' }}>
              <div style={{ width: '24px', height: '1px', background: C.accent, marginBottom: '14px', opacity: 0.5 }} />
              <h2 style={{ fontFamily: ff, fontSize: '21px', fontWeight: '600', marginBottom: '12px' }}>{sec.heading}</h2>
              <p style={{ fontSize: '15px', lineHeight: '1.9', color: C.textMuted, fontWeight: '300' }}>{sec.body}</p>
            </div>
          ))}

          {/* Phil nudge */}
          <div onClick={openPhilChat} style={{ background: C.surfaceEl, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.accent}`, padding: '18px 22px', borderRadius: '4px', marginTop: '20px', marginBottom: '48px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '20px' }}>💬</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '3px' }}>Questions about this module?</div>
              <div style={{ color: C.textMuted, fontSize: '13px', fontWeight: '300' }}>
                {hasFullPhil ? 'Ask Phil — he knows this inside out.' : `Ask Phil — ${philRemaining} free question${philRemaining !== 1 ? 's' : ''} remaining.`}
              </div>
            </div>
          </div>

          {/* Acadia CTA */}
          <div className="ch-acadia-cta" style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderLeft: `3px solid ${C.accent}`, padding: '28px 32px', borderRadius: '4px' }}>
            <div style={{ fontFamily: ff, fontSize: '19px', fontWeight: '600', marginBottom: '10px' }}>Want this done for you?</div>
            <p style={{ color: C.textMuted, fontSize: '14px', lineHeight: '1.75', marginBottom: '20px', fontWeight: '300' }}>Acadia Digital Group handles strategy, creative, and execution — so you can focus on running your business.</p>
            <button style={{ background: C.accent, color: '#0C0B09', border: 'none', padding: '12px 26px', borderRadius: '3px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}>Book a Strategy Call →</button>
          </div>

          {/* Next module */}
          {activeModule.id < MODULES.length && (
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
              <div className="ch-next-module ch-next" onClick={() => openModule(MODULES[activeModule.id])} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px 18px', border: `1px solid ${C.border}`, borderRadius: '4px', background: C.surface, maxWidth: '300px', transition: 'border-color 0.2s' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.textMuted, fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Next</div>
                  <div style={{ fontFamily: ff, fontSize: '14px', fontWeight: '600', lineHeight: '1.3' }}>{MODULES[activeModule.id].title}</div>
                </div>
                <span style={{ color: C.accent, fontSize: '18px' }}>→</span>
              </div>
            </div>
          )}
        </div>

      ) : (
        <>
          {/* ── HERO ── */}
          <div className="ch-hero" style={{ padding: '80px 24px 64px', maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            <div className="ch-fade d1" style={{ color: C.accent, fontSize: '10px', fontWeight: '600', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '24px' }}>A Chiron Education · Powered by Acadia Digital Group</div>
            <h1 className="ch-fade d2" style={{ fontFamily: ff, fontSize: 'clamp(36px,6.5vw,72px)', fontWeight: '700', lineHeight: '1.08', marginBottom: '22px' }}>
              Stop Guessing.<br /><span style={{ color: C.accent }}>Start Scaling.</span>
            </h1>
            <p className="ch-fade d3" style={{ color: C.textMuted, fontSize: '16px', lineHeight: '1.75', maxWidth: '500px', margin: '0 auto 40px', fontWeight: '300' }}>
              Real marketing education — built for business owners who are done wasting budget and ready to scale with intention.
            </p>
            <div className="ch-fade d4 ch-phil-quote" style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, padding: '22px 28px', borderRadius: '4px', textAlign: 'left', maxWidth: '520px', margin: '0 auto 40px' }}>
              <p style={{ fontFamily: ff, fontStyle: 'italic', color: C.textMuted, fontSize: '15px', lineHeight: '1.8', marginBottom: '10px' }}>
                "Name's Chiron. Some people call me Phil. I've trained more businesses than I care to count — and I'm here to make sure yours is one that actually makes it."
              </p>
              <div style={{ color: C.accent, fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em' }}>— CHIRON</div>
            </div>
            <div className="ch-fade d5 ch-hero-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('ch-cur')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: C.accent, color: '#0C0B09', border: 'none', padding: '15px 34px', borderRadius: '3px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: sf, minHeight: '48px' }}>
                Start Free
              </button>
              <button onClick={openPhilChat} className="ch-ghost" style={{ background: 'transparent', color: C.text, border: `1px solid ${C.border}`, padding: '15px 34px', borderRadius: '3px', fontSize: '15px', cursor: 'pointer', fontFamily: sf, transition: 'background 0.2s', minHeight: '48px' }}>
                Talk to Phil
              </button>
            </div>
          </div>

          <div style={{ width: '36px', height: '1px', background: C.accent, margin: '0 auto 64px', opacity: 0.4 }} />

          {/* ── CURRICULUM ── */}
          <div id="ch-cur" className="ch-curriculum" style={{ padding: '0 24px 64px', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ color: C.accent, fontSize: '10px', fontWeight: '600', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '10px' }}>Curriculum</div>
            <h2 style={{ fontFamily: ff, fontSize: 'clamp(26px,3.5vw,36px)', fontWeight: '600', marginBottom: '6px' }}>Six modules. No fluff.</h2>
            <p style={{ color: C.textMuted, fontSize: '14px', marginBottom: '36px', fontWeight: '300' }}>Start free. Go deeper when you're ready.</p>
            <div className="ch-module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
              {MODULES.map(mod => (
                <div key={mod.id} className="ch-card" onClick={() => openModule(mod)} style={{ background: C.surface, border: `1px solid ${isModuleUnlocked(mod) ? C.borderLight : C.border}`, borderRadius: '5px', padding: '24px', cursor: 'pointer' }}>
                  <div style={{ fontFamily: ff, fontSize: '52px', fontWeight: '700', color: C.border, lineHeight: '1', marginBottom: '14px', userSelect: 'none' }}>0{mod.id}</div>
                  <Tag>{mod.tag}</Tag>
                  <div style={{ fontFamily: ff, fontSize: '17px', fontWeight: '600', lineHeight: '1.3', margin: '10px 0 5px' }}>{mod.title}</div>
                  <div style={{ color: C.textMuted, fontSize: '13px', marginBottom: '18px', lineHeight: '1.5', fontWeight: '300' }}>{mod.subtitle}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: C.textFaint, fontSize: '12px' }}>⏱ {mod.duration}</span>
                    <ModuleStatus mod={mod} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle callout */}
            {unlocked !== 'all' && (
              <div className="ch-bundle" style={{ marginTop: '24px', background: C.surface, border: `1px solid ${C.borderLight}`, borderLeft: `3px solid ${C.accent}`, padding: '22px 28px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: ff, fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>Unlock all 4 advanced modules</div>
                  <div style={{ color: C.textMuted, fontSize: '13px', fontWeight: '300' }}>Modules 3–6 + full Phil access forever. Save ${(PRICES.single * 4) - PRICES.bundle} vs. buying individually.</div>
                </div>
                <button onClick={() => { if (!isRegistered) { setShowGate(true); setGateStep('form'); } else { setShowPricing(true); } }} style={{ background: C.accent, color: '#0C0B09', border: 'none', padding: '12px 24px', borderRadius: '3px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: sf }}>
                  Bundle — ${PRICES.bundle}
                </button>
              </div>
            )}
          </div>

          {/* ── STATS ── */}
          <div className="ch-stats" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '40px 24px', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {[{ n: '6', label: 'Modules' }, { n: '~90 min', label: 'Content' }, { n: '$0', label: 'To Start' }, { n: '0', label: 'Fluff' }].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: ff, fontSize: '28px', fontWeight: '700', color: C.accent, marginBottom: '4px' }}>{n}</div>
                <div style={{ color: C.textMuted, fontSize: '11px', fontWeight: '300', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="ch-cta-section" style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '56px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: ff, fontStyle: 'italic', color: C.textMuted, fontSize: '15px', maxWidth: '520px', margin: '0 auto 10px', lineHeight: '1.7' }}>"I've seen too many businesses with great products lose to competitors with better marketing. That ends here."</div>
            <div style={{ color: C.accent, fontSize: '11px', fontWeight: '600', letterSpacing: '0.2em', marginBottom: '28px' }}>— CHIRON</div>
            <button onClick={() => document.getElementById('ch-cur')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: C.accent, color: '#0C0B09', border: 'none', padding: '14px 36px', borderRadius: '3px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}>
              Start Learning Free →
            </button>
          </div>

          {/* ── FOOTER ── */}
          <footer className="ch-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontFamily: ff, fontSize: '15px', color: C.accent, fontWeight: '700', letterSpacing: '0.12em' }}>CHIRON</div>
            <div style={{ color: C.textFaint, fontSize: '11px' }}>Powered by Acadia Digital Group</div>
            <div style={{ color: C.textFaint, fontSize: '11px' }}>© 2026</div>
          </footer>
        </>
      )}

      {/* ── PHIL CHAT ── */}
      {showChat && (
        <div className="ch-slide ch-chat-window" style={{ position: 'fixed', bottom: '88px', right: '16px', width: 'min(350px, calc(100vw - 32px))', background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: '8px', overflow: 'hidden', zIndex: 200, boxShadow: '0 24px 64px rgba(0,0,0,0.65)' }}>
          <div style={{ background: C.surfaceEl, padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: ff, fontSize: '15px', fontWeight: '600' }}>Chiron</div>
              <div style={{ color: C.textMuted, fontSize: '11px', marginTop: '1px' }}>
                aka Phil · {hasFullPhil ? 'Full access' : `${philRemaining} free question${philRemaining !== 1 ? 's' : ''} left`}
              </div>
            </div>
            <span onClick={() => setShowChat(false)} style={{ color: C.textMuted, cursor: 'pointer', fontSize: '20px', padding: '4px', lineHeight: '1' }}>×</span>
          </div>
          <div style={{ padding: '14px', height: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ padding: '11px 13px', borderRadius: '4px', fontSize: '14px', lineHeight: '1.65', color: C.text, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: m.role === 'user' ? '82%' : '100%', background: m.role === 'user' ? C.accentDim : C.surfaceEl, borderLeft: m.role === 'assistant' ? `2px solid ${C.accent}` : 'none' }}>{m.content}</div>
            ))}
            {chatLoading && <div style={{ padding: '11px 13px', borderRadius: '4px', background: C.surfaceEl, borderLeft: `2px solid ${C.accent}`, fontSize: '14px', color: C.textMuted }}><span className="ch-pulse">Phil is thinking...</span></div>}
            <div ref={chatEnd} />
          </div>
          <div style={{ display: 'flex', padding: '10px', borderTop: `1px solid ${C.border}`, gap: '8px' }}>
            <input className="chi" style={{ flex: 1, background: C.surfaceEl, border: `1px solid ${C.border}`, borderRadius: '3px', padding: '9px 12px', color: C.text, fontSize: '14px', fontFamily: sf, transition: 'border-color 0.2s' }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask Phil anything..." />
            <button onClick={sendMessage} disabled={chatLoading} style={{ background: chatLoading ? C.border : C.accent, color: chatLoading ? C.textMuted : '#0C0B09', border: 'none', borderRadius: '3px', padding: '9px 14px', cursor: chatLoading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '15px', fontFamily: sf }}>→</button>
          </div>
        </div>
      )}

      {/* ── CHAT BUTTON ── */}
      <button className="ch-chat-btn" onClick={() => showChat ? setShowChat(false) : openPhilChat()} style={{ position: 'fixed', bottom: '20px', right: '16px', background: C.accent, color: '#0C0B09', border: 'none', borderRadius: '50%', width: '52px', height: '52px', cursor: 'pointer', zIndex: 200, boxShadow: '0 4px 24px rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: showChat ? '20px' : '18px', transition: 'all 0.2s', fontFamily: sf }}>
        {showChat ? '×' : '💬'}
      </button>

      {/* ── EMAIL GATE MODAL ── */}
      {showGate && (
        <div onClick={e => e.target === e.currentTarget && setShowGate(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '16px' }}>
          <div className="ch-slide" style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: '8px', padding: '40px 36px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>

            {gateStep === 'form' ? (
              <>
                <div style={{ fontFamily: ff, fontSize: '36px', color: C.accent, marginBottom: '16px' }}>🏛</div>
                <h2 style={{ fontFamily: ff, fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Create Your Free Account</h2>
                <p style={{ color: C.textMuted, fontSize: '14px', lineHeight: '1.8', marginBottom: '26px', fontWeight: '300' }}>
                  Free access to Modules 1 & 2 plus {FREE_PHIL_LIMIT} questions with Phil. Unlock advanced modules anytime — yours to keep, no subscription.
                </p>
                <input
                  className="chi"
                  style={{ width: '100%', background: C.surfaceEl, border: `1px solid ${emailError ? '#E05555' : C.border}`, borderRadius: '3px', padding: '13px 16px', color: C.text, fontSize: '15px', fontFamily: sf, marginBottom: emailError ? '6px' : '12px', transition: 'border-color 0.2s' }}
                  type="email" placeholder="Your email address"
                  value={email} onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()}
                />
                {emailError && <div style={{ color: '#E05555', fontSize: '12px', marginBottom: '10px', textAlign: 'left' }}>{emailError}</div>}
                <button onClick={handleRegister} disabled={submitting} style={{ width: '100%', background: submitting ? C.border : C.accent, color: submitting ? C.textMuted : '#0C0B09', border: 'none', borderRadius: '3px', padding: '13px', fontSize: '15px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: sf }}>
                  {submitting ? 'Saving...' : 'Start Free →'}
                </button>
                <div onClick={() => setShowGate(false)} style={{ color: C.textFaint, fontSize: '12px', marginTop: '14px', cursor: 'pointer' }}>Maybe later</div>
              </>
            ) : (
              <>
                {/* Success step — with PWA install prompt */}
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
                <h2 style={{ fontFamily: ff, fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>You're in.</h2>
                <p style={{ color: C.textMuted, fontSize: '14px', lineHeight: '1.8', marginBottom: '28px', fontWeight: '300' }}>
                  Modules 1 & 2 are unlocked. Phil is ready when you are.
                </p>

                {/* PWA install prompt — only on mobile, only if not already installed */}
                {isMobile() && !isInStandaloneMode() && (
                  <div style={{ background: C.surfaceEl, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.accent}`, padding: '16px 20px', borderRadius: '4px', marginBottom: '20px', textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                      📱 Add Chiron to your Home Screen
                    </div>
                    <div style={{ color: C.textMuted, fontSize: '13px', fontWeight: '300', marginBottom: '14px', lineHeight: '1.6' }}>
                      {isIOS()
                        ? 'Tap Share ⬆ at the bottom of your browser, then tap "Add to Home Screen".'
                        : 'Get instant access from your home screen — no App Store needed.'}
                    </div>
                    {!isIOS() && (
                      <button onClick={triggerInstall} style={{ background: C.accent, color: '#0C0B09', border: 'none', borderRadius: '3px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}>
                        Add to Home Screen
                      </button>
                    )}
                    {isIOS() && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.accent, fontSize: '13px', fontWeight: '500' }}>
                        <span>Tap</span>
                        <span style={{ fontSize: '18px' }}>⬆</span>
                        <span>then "Add to Home Screen"</span>
                      </div>
                    )}
                  </div>
                )}

                <button onClick={handleGateSuccess} style={{ width: '100%', background: C.accent, color: '#0C0B09', border: 'none', borderRadius: '3px', padding: '13px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}>
                  Start Learning →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PRICING MODAL ── */}
      {showPricing && (
        <div onClick={e => e.target === e.currentTarget && setShowPricing(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '16px' }}>
          <div className="ch-slide" style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: '8px', padding: '40px 36px', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontFamily: ff, fontSize: '34px', color: C.accent, marginBottom: '12px' }}>🏛</div>
              <h2 style={{ fontFamily: ff, fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
                {pendingModule ? `Unlock Module ${pendingModule.id}` : 'Unlock Your Modules'}
              </h2>
              <p style={{ color: C.textMuted, fontSize: '13px', lineHeight: '1.7', fontWeight: '300' }}>One-time purchase. No subscription. Yours permanently.</p>
            </div>

            {/* Bundle */}
            <div className="ch-tier" onClick={purchaseBundle} style={{ border: `2px solid ${C.accent}`, borderRadius: '6px', padding: '18px 22px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', left: '18px', background: C.accent, color: '#0C0B09', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '2px', letterSpacing: '0.1em' }}>BEST VALUE</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: ff, fontSize: '16px', fontWeight: '600', marginBottom: '3px' }}>Full Bundle — All 4 Modules</div>
                  <div style={{ color: C.textMuted, fontSize: '12px', fontWeight: '300' }}>Modules 3–6 + full Phil access forever</div>
                </div>
                <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                  <div style={{ fontFamily: ff, fontSize: '22px', fontWeight: '700', color: C.accent }}>${PRICES.bundle}</div>
                  <div style={{ color: C.textFaint, fontSize: '11px', textDecoration: 'line-through' }}>${PRICES.single * 4}</div>
                </div>
              </div>
            </div>

            <div style={{ color: C.textMuted, fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '18px 0 8px' }}>Or unlock individually</div>
            {MODULES.filter(m => !m.free && !isModuleUnlocked(m)).map(mod => (
              <div key={mod.id} className="ch-tier" onClick={() => purchaseModule(mod)} style={{ border: `1px solid ${C.border}`, borderRadius: '5px', padding: '14px 18px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>Module {mod.id}: {mod.title}</div>
                  <div style={{ color: C.textMuted, fontSize: '12px', fontWeight: '300' }}>{mod.duration} · Phil access for this topic</div>
                </div>
                <div style={{ fontFamily: ff, fontSize: '18px', fontWeight: '700', color: C.accent, whiteSpace: 'nowrap', marginLeft: '14px' }}>${PRICES.single}</div>
              </div>
            ))}
            <div onClick={() => setShowPricing(false)} style={{ color: C.textFaint, fontSize: '12px', marginTop: '18px', cursor: 'pointer', textAlign: 'center' }}>Maybe later</div>
          </div>
        </div>
      )}

      {/* ── PHIL UPGRADE GATE ── */}
      {showPhilGate && (
        <div onClick={e => e.target === e.currentTarget && setShowPhilGate(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '16px' }}>
          <div className="ch-slide" style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: '8px', padding: '40px 36px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>💬</div>
            <h2 style={{ fontFamily: ff, fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>You've Used Your Free Questions</h2>
            <p style={{ color: C.textMuted, fontSize: '14px', lineHeight: '1.8', marginBottom: '24px', fontWeight: '300' }}>
              Phil doesn't come free forever, kid. Unlock any module and you get full Phil access — permanently.
            </p>
            <button onClick={() => { setShowPhilGate(false); setShowPricing(true); }} style={{ width: '100%', background: C.accent, color: '#0C0B09', border: 'none', borderRadius: '3px', padding: '13px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: sf, marginBottom: '10px' }}>
              Unlock a Module →
            </button>
            <div onClick={() => setShowPhilGate(false)} style={{ color: C.textFaint, fontSize: '12px', cursor: 'pointer' }}>Maybe later</div>
          </div>
        </div>
      )}

      {/* ── VERIFYING PURCHASE OVERLAY ── */}
      {verifying && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ fontFamily: ff, fontSize: '32px', color: C.accent }}>🏛</div>
          <div style={{ fontFamily: ff, fontSize: '20px', fontWeight: '600', color: C.text }}>Verifying your purchase...</div>
          <div style={{ color: C.textMuted, fontSize: '14px', fontWeight: '300' }}>Hang tight — this takes a second.</div>
        </div>
      )}

      {/* ── PURCHASE LOADING OVERLAY ── */}
      {purchaseLoading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: '8px', padding: '32px 40px', textAlign: 'center' }}>
            <div style={{ color: C.accent, fontSize: '13px', fontWeight: '600', letterSpacing: '0.1em' }}>Redirecting to checkout...</div>
          </div>
        </div>
      )}

      {/* ── PURCHASE SUCCESS MODAL ── */}
      {showPurchaseSuccess && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '16px' }}>
          <div className="ch-slide" style={{ background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: '8px', padding: '44px 40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontFamily: ff, fontSize: '26px', fontWeight: '700', marginBottom: '10px' }}>You're unlocked.</h2>
            <p style={{ color: C.textMuted, fontSize: '14px', lineHeight: '1.8', marginBottom: '28px', fontWeight: '300' }}>
              {unlocked === 'all'
                ? 'All six modules and full Phil access are yours. No expiry, no subscription.'
                : 'Your module and Phil access are ready. No expiry, no subscription.'}
            </p>

            {/* PWA prompt on mobile */}
            {isMobile() && !isInStandaloneMode() && (
              <div style={{ background: C.surfaceEl, border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.accent}`, padding: '14px 18px', borderRadius: '4px', marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>📱 Add Chiron to your Home Screen</div>
                <div style={{ color: C.textMuted, fontSize: '12px', fontWeight: '300', marginBottom: isIOS() ? '0' : '12px', lineHeight: '1.6' }}>
                  {isIOS() ? 'Tap Share ⬆ then "Add to Home Screen" for instant access.' : 'Install for instant access — no App Store needed.'}
                </div>
                {!isIOS() && (
                  <button onClick={triggerInstall} style={{ background: C.accent, color: '#0C0B09', border: 'none', borderRadius: '3px', padding: '9px 18px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}>
                    Add to Home Screen
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => { setShowPurchaseSuccess(false); setShowPricing(false); }}
              style={{ width: '100%', background: C.accent, color: '#0C0B09', border: 'none', borderRadius: '3px', padding: '13px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: sf }}
            >
              Start Learning →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
