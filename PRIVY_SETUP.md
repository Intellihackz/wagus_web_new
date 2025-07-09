# Privy Authentication Setup

This project uses Privy for authentication. Follow these steps to configure Privy for your project:

## Configuration Steps

1. Sign up for a Privy account at [https://privy.io](https://privy.io) and create a new app.

2. Copy your Privy App ID from the Privy Dashboard.

3. Set up the environment variable:
   - Copy the `.env.example` file to `.env.local` (if not already done)
   - Update the `NEXT_PUBLIC_PRIVY_APP_ID` value in `.env.local` with your actual Privy App ID:

```
NEXT_PUBLIC_PRIVY_APP_ID=your-actual-privy-app-id
```

## Usage

The Privy authentication provider is already set up in the application. You can use the `usePrivyAuth` hook from `src/lib/hooks/use-privy-auth.ts` in your components to access Privy authentication features.

Example:

```tsx
import { usePrivyAuth } from '@/lib/hooks/use-privy-auth';

function YourComponent() {
  const { ready, authenticated, user, login, logout } = usePrivyAuth();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return authenticated ? (
    <button onClick={logout}>Sign Out</button>
  ) : (
    <button onClick={login}>Sign In</button>
  );
}
```

## Further Customization

For advanced customization options, refer to the [Privy documentation](https://docs.privy.io/).

You can customize the authentication flow, wallet connection options, and UI appearance in the `config` object in `src/app/providers.tsx`.
