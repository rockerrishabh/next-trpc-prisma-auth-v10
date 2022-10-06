import Head from "next/head";
import { Fragment, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

function Layout({ title, children, className }: Props) {
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={className}>{children}</main>
    </Fragment>
  );
}

export default Layout;