import Head from "next/head";
import { Profile } from "@/components/page/my-profile";
import { getAuthSession } from "@/components/graphql/auth-ssr";

export default async () => {
  const session = await getAuthSession();
  console.log(session);

  return (
    <>
      <Head>
        <title>SLOTOTOP - My Profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Profile />
    </>
  );
};
