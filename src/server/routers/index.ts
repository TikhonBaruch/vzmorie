import { router } from "../trpc";
import { postRouter } from "./post";
import { userRouter } from "./user";
import { tagRouter } from "./tag";
import { subscriberRouter } from "./subscriber";

export const appRouter = router({
  post: postRouter,
  user: userRouter,
  tag: tagRouter,
  subscriber: subscriberRouter,
});

export type AppRouter = typeof appRouter;
