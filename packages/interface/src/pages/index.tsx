import Head from "next/head";
import { siteURL } from "../constants";
import Layout from "../components/layout";

const pageTitle: string = "Shakestats - Home";
const pageDescription: string = "Statistical data for the Handshake protocol.";
const pageURL: string = siteURL;

function Home(): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={pageURL} />
        <meta property="og:description" content={pageDescription} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:url" content={pageURL} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>
    </Layout>
  );
}

export default Home;