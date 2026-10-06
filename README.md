# Jahun Local Government Council portal

A civic portal built with TanStack Start, React, TypeScript, Tailwind CSS v4 and Lovable Cloud.

## Local development
1. Install Bun and clone the project from your connected repository.
2. Run `bun install` in the project folder.
3. Use the Lovable-managed environment configuration for your project. Do not commit secret keys.
4. Run `bun run dev` and open the local address printed by Vite.
5. Run `bun run test` to check routing and application validation.

## Included
Public council pages, eleven-ward directory, email/password and Google sign-in, six service application forms, private document uploads, bursary steps, application tracking and public certificate lookup.

The workspace uses TanStack Start rather than the requested Next.js; the portal intent is implemented on the supported stack. The database migrations are managed in `drizzle/migrations`.

## Before official launch
Supply the authorised chairman photograph, verified ward facilities and representatives, emergency numbers, official email, approved project/gazette publications and legal retention policy. Landscape imagery is illustrative; the leadership photo area is an office placeholder, not a fabricated portrait. Coat of arms sourced from Wikimedia Commons, CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Coat_of_arms_of_Nigeria.svg.

Council approval screens, signed certificate generation/QR issuance, state scheme integration, online levies and production rate limiting require a further operational implementation. A submitted application does not issue a certificate or make a payment. The current certificate page verifies only council-issued records. No privileged staff role is granted automatically.
