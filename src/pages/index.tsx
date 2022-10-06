import type { NextPage } from "next";
import Layout from "../layout";
import { useSession, signIn, signOut } from "next-auth/react";
import { Fragment } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const postsQuery = trpc.post.posts.useQuery();

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });
  return (
    <Layout
      title="Gaming Duniya"
      className="max-w-7xl space-y-3 flex bg-gray-200 flex-col mx-auto"
    >
      <section>
        {session ? (
          <Fragment>
            {postsQuery.data?.map((item) => (
              <Fragment key={item.id}>
                <p>{item.title}</p>
              </Fragment>
            ))}
            <p>{session.user?.name}</p>
            <button
              className="rounded bg-red-500/90 text-white hover:bg-red-500/80 py-2 px-4"
              type="button"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Sign Out
            </button>
          </Fragment>
        ) : (
          <button
            className="rounded bg-blue-500/90 text-white hover:bg-blue-500/80 py-2 px-4"
            type="button"
            onClick={() =>
              signIn("google", {
                callbackUrl: "/",
              })
            }
          >
            Sign In
          </button>
        )}
      </section>
    </Layout>
  );
};

export default Home;
