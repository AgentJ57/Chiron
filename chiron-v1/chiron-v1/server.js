import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Prices (in cents)
const PRICES = {
  single: 2700,  // $27
  bundle: 5700,  // $57
};

app.use(cors());

// ── Stripe webhook needs raw body — must come BEFORE express.json() ──
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) return res.status(200).send('No webhook secret configured.');

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle completed checkouts (optional — for server-side logging/fulfillment)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Purchase completed:', session.metadata);
  }

  res.json({ received: true });
});

app.use(express.json());

// ─── Serve React build ────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));

// ─── Mailchimp Subscribe Endpoint ─────────────────────────────────────────────
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;

  // Mailchimp API key format: xxxxxxxxxxxxxxxx-us21
  // The datacenter is everything after the dash
  const DC = API_KEY?.split('-')[1];

  if (!API_KEY || !LIST_ID || !DC) {
    console.error('Missing Mailchimp env vars');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const response = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['chiron'],
          merge_fields: {
            SOURCE: 'Chiron App',
          },
        }),
      }
    );

    const data = await response.json();

    // Member already exists — treat as success
    if (response.ok || data.title === 'Member Exists') {
      return res.json({ success: true });
    }

    console.error('Mailchimp error:', data);
    return res.status(400).json({ error: data.detail || 'Subscription failed.' });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Server error. Try again.' });
  }
});

// ─── Stripe: Create Checkout Session ─────────────────────────────────────────
app.post('/api/create-checkout-session', async (req, res) => {
  const { type, moduleId, email } = req.body;
  // type: 'module' | 'bundle'

  if (!type || (type === 'module' && !moduleId)) {
    return res.status(400).json({ error: 'Invalid purchase request.' });
  }

  const BASE_URL = process.env.BASE_URL || `https://${req.headers.host}`;

  try {
    const isBundle = type === 'bundle';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isBundle
                ? 'Chiron — Full Bundle (Modules 3–6 + Phil)'
                : `Chiron — Module ${moduleId}`,
              description: isBundle
                ? 'Unlock all 4 advanced modules and full Phil access. Yours permanently.'
                : `Unlock Module ${moduleId} and Phil access for this topic. Yours permanently.`,
            },
            unit_amount: isBundle ? PRICES.bundle : PRICES.single,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type,
        moduleId: moduleId ? String(moduleId) : '',
        product: isBundle ? 'bundle' : `module_${moduleId}`,
      },
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// ─── Stripe: Verify Purchase ──────────────────────────────────────────────────
app.get('/api/verify-purchase', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'No session ID provided.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed.' });
    }

    const { type, moduleId } = session.metadata;
    const isBundle = type === 'bundle';

    res.json({
      success: true,
      type,
      unlocked: isBundle ? 'all' : [parseInt(moduleId)],
      customerEmail: session.customer_email,
    });
  } catch (err) {
    console.error('Verify purchase error:', err);
    res.status(500).json({ error: 'Could not verify purchase.' });
  }
});

// ─── Catch-all — serve React for client-side routing ─────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Chiron running on port ${PORT}`);
});
