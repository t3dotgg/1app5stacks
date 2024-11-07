import VotePage from "./routes/home.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <VotePage />,
  },
  { path: "/results", element: <div>Results!</div> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
