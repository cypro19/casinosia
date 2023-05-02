import Head from "next/head";
import { createClientSSR } from "@/components/graphql/client-ssr";
import { HomePage } from "@/components/page/home/home-page";
import { getAuthSession } from "@/components/graphql/auth-ssr";

const client = createClientSSR();

export default async () => {
  const result = await client.listGames();
  const session = await getAuthSession();
  console.log("session", session);

  return (
    <>
      <Head>
        <title>SLOTOTOP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <HomePage popularGames={result.games} />
      </div>
    </>
  );
};
