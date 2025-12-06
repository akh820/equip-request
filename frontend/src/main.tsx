import { createRoot } from "react-dom/client";
import "./index.css";
import i18n from "@/lib/i18n";

import { RouterProvider } from "react-router";
import router from "./router/index.tsx";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

document.title = i18n.t("meta.title");

i18n.on("languageChanged", () => {
  document.title = i18n.t("meta.title");
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Toaster position="top-center" richColors closeButton duration={3000} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
