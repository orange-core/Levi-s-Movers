# Levi's Movers — OrangeCore redesign concept

An independent, private redesign concept for Levi's Movers. This project is not the official company website and must not be published as the company's official site without written approval.

## Stack

- Multi-page HTML
- CSS design system
- Vanilla JavaScript
- GSAP + ScrollTrigger
- Vite for local development and production builds
- Cloudflare Pages Functions for the quote endpoint
- Supabase for enquiry storage
- Brevo for optional email notifications

## Local development

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Pages

- Home
- About
- Local moving
- Long-distance moving
- Packing services
- Commercial moving
- Service areas
- Contact / multi-step quote request

## Quote endpoint setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Configure the following Cloudflare Pages environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_QUOTES_TABLE=moving_quote_enquiries`
   - `BREVO_API_KEY` (optional until email notifications are enabled)
   - `BREVO_SENDER_EMAIL` (optional)
   - `BREVO_NOTIFY_EMAIL` (optional)
4. Keep secrets out of Git and frontend code.
5. Test successful submissions, invalid data, database failures and notification delivery before any live launch.

The quote form is a request-for-contact workflow, not an automatic price calculator. Pricing rules and service availability must be confirmed by Levi's Movers.

## Brand assets

The downloaded official logo has not yet been supplied to this repository. The current header uses a temporary typographic mark. Replace it with an approved logo asset in `assets/logo/` after the user supplies the file and the company authorizes its use.

## Content and launch checklist

- Verify company-approved service descriptions, phone, email and address.
- Replace or approve all photography and brand assets.
- Verify actual service-area coverage.
- Add only authorized customer reviews and business claims.
- Replace the draft privacy notice with the company's approved policy.
- Verify form delivery and data retention practices.
- Add redirects and metadata after auditing the current live URLs.
- Obtain written approval before presenting this as the company's official website.
