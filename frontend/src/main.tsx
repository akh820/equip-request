import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import router from "./router/index.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <Toaster position="top-center" richColors />
  </>
);
