import OAuthLoginForm from "@/components/Auth/oauth-login-form";
import { getConfiguredOAuthProviders } from "@/lib/oauth-provider-config";

type Props = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function SignUpPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/dashboard";
  const providers = getConfiguredOAuthProviders();

  return <OAuthLoginForm providers={providers} callbackUrl={callbackUrl} />;
}
