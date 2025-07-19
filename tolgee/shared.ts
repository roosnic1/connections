import { DevTools, Tolgee, FormatSimple } from "@tolgee/web";

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const ALL_LANGUAGES = ["en", "de"];

export const DEFAULT_LANGUAGE = "de";

export function TolgeeBase() {
  return (
    Tolgee()
      .use(FormatSimple())
      .use(DevTools())
      // replace with .use(FormatIcu()) for rendering plurals, foramatted numbers, etc.
      .updateDefaults({
        apiKey,
        apiUrl,
      })
  );
}
