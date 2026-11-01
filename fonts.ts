import { IBM_Plex_Mono } from "next/font/google";

/*
 * The Arcade typeface pair lives here so both sites load the same thing:
 *   - labels and metadata: IBM Plex Mono, exposed as --font-plex-mono
 *   - display and reading text: Helvetica, set as --font-family in arcade.module.css
 * next/font is a build-time transform, so calling it from this module is fine; each app
 * that imports it gets its own self-hosted copy.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "fallback",
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
