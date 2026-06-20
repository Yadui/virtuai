export type OAuthProviderId = "google" | "github";

type OAuthProviderDefinition = {
  id: OAuthProviderId;
  name: string;
  clientIdEnvs: string[];
  clientSecretEnvs: string[];
};

const definitions: OAuthProviderDefinition[] = [
  {
    id: "google",
    name: "Google",
    clientIdEnvs: ["GOOGLE_CLIENT_ID"],
    clientSecretEnvs: ["GOOGLE_CLIENT_SECRET"],
  },
  {
    id: "github",
    name: "GitHub",
    clientIdEnvs: ["GITHUB_CLIENT_ID"],
    clientSecretEnvs: ["GITHUB_CLIENT_SECRET"],
  },
];

const readFirstEnv = (names: string[]) => {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
};

export const getOAuthProviderCredentials = (id: OAuthProviderId) => {
  const def = definitions.find((d) => d.id === id);
  if (!def) return null;
  const clientId = readFirstEnv(def.clientIdEnvs);
  const clientSecret = readFirstEnv(def.clientSecretEnvs);
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
};

export const getConfiguredOAuthProviders = () =>
  definitions
    .filter((d) => Boolean(getOAuthProviderCredentials(d.id)))
    .map((d) => ({ id: d.id, name: d.name }));
