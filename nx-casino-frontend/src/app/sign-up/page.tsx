import { SignUp } from "@/components/sign-up";
import { ClientProviders } from "../client-providers";

export default () => {
  return (
    <ClientProviders>
      <SignUp />
    </ClientProviders>
  );
};
