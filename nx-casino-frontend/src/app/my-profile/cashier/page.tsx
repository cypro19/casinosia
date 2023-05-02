import Head from "next/head";
import { Cashier } from "@/components/page/cashier";
import { getAuthSession } from "@/components/graphql/auth-ssr";

export default async () => {
  const session = await getAuthSession();
  console.log(session);

  return (
    <>
      <Head>
        <title>SLOTOTOP - Cashier</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Cashier />
    </>
  );
};
