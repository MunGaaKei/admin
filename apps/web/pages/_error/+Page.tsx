import { Button } from "@ioca/react";
import { navigate } from "vike/client/router";

export default function Page({ is404, abortStatusCode }: { is404?: boolean; abortStatusCode?: number }) {
  const statusCode = is404 ? 404 : abortStatusCode ?? 500;

  const meta: Record<number, { title: string; description: string }> = {
    401: { title: "401 Unauthorized", description: "You don't have permission to access this page." },
    404: { title: "404 Not Found", description: "The page you're looking for doesn't exist or has been moved." },
  };

  const m = meta[statusCode] ?? { title: "Something went wrong", description: "An unexpected error occurred." };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 72, fontWeight: 700, color: "var(--color-text-secondary)", margin: 0 }}>
        {statusCode}
      </h1>
      <p style={{ fontSize: 18, color: "var(--color-text-tertiary)", margin: 0 }}>{m.description}</p>
      <Button onClick={() => navigate("/")} style={{ marginTop: 8 }}>
        Go Home
      </Button>
    </div>
  );
}
