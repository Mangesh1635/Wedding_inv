import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting.ts";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-burgundy">४०४</h1>
        <h2 className="mt-4 text-xl text-midnight">पान सापडले नाही</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          आपण शोधत असलेले पान अस्तित्वात नाही किंवा हलविले गेले आहे.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-burgundy px-5 py-2 text-sm font-medium text-cream transition-colors hover:opacity-90"
          >
            मुख्यपृष्ठावर परत जा
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-burgundy">
          पान लोड होऊ शकले नाही
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          काहीतरी अडचण आली आहे. कृपया पुन्हा प्रयत्न करा.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-burgundy px-4 py-2 text-sm font-medium text-cream transition-colors hover:opacity-90"
          >
            पुन्हा प्रयत्न करा
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-gold bg-cream px-4 py-2 text-sm font-medium text-midnight"
          >
            मुख्यपृष्ठ
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "कीर्ती ❁ विशाल — विवाह सोहळा | Marathi Wedding Invitation" },
      {
        name: "description",
        content:
          "कीर्ती आणि विशाल यांच्या विवाहसोहळ्याचे सस्नेह डिजिटल निमंत्रण — कार्यक्रम, ठिकाण, कुटुंब आणि शुभेच्छा.",
      },
      { name: "author", content: "Mangesh Dhanmane" },
      { property: "og:title", content: "कीर्ती ❁ विशाल — विवाह सोहळा" },
      {
        property: "og:description",
        content: "आमच्या विवाह सोहळ्यास सहकुटुंब सहपरिवार उपस्थित राहण्याचे सस्नेह निमंत्रण.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Marathi&family=Mukta:wght@300;400;500;600;700&family=Hind:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="mr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
