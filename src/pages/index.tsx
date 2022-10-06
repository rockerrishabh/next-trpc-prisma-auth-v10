import type { NextPage } from "next";
import Layout from "../layout";
import { useSession, signIn, signOut } from "next-auth/react";
import { Fragment } from "react";
import { trpc } from "../utils/trpc";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormData = {
  title: string;
  slug: string;
  content: string;
};

const Home: NextPage = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const postsQuery = trpc.post.posts.useQuery();

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
      reset();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    toast.promise(addPost.mutateAsync(data), {
      loading: "Saving...",
      success: <b>Post saved!</b>,
      error: <b>Could not save.</b>,
    });
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
            <form onSubmit={onSubmit}>
              <section>
                <label htmlFor="title">Title</label>
                <input
                  {...register("title")}
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  className="outline-none rounded border border-gray-400"
                />
              </section>
              <section>
                <label htmlFor="slug">Slug</label>
                <input
                  {...register("slug")}
                  id="slug"
                  name="slug"
                  type="text"
                  placeholder="Slug"
                  className="outline-none rounded border border-gray-400"
                />
              </section>
              <section>
                <label htmlFor="content">Content</label>
                <input
                  {...register("content")}
                  id="content"
                  name="content"
                  type="text"
                  placeholder="Content"
                  className="outline-none rounded border border-gray-400"
                />
              </section>
              <button type="submit">Submit</button>
            </form>
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
