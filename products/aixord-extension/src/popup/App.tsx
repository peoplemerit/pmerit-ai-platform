import React, { useEffect, useState } from "react";

type AuthStatus = { isAuthenticated: boolean; token: string | null };

async function bg<TReq, TRes>(msg: TReq): Promise<TRes> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (res) => {
      const err = chrome.runtime.lastError;
      if (err) return reject(err);
      resolve(res);
    });
  });
}

export function App() {
  const [status, setStatus] = useState<AuthStatus>({ isAuthenticated: false, token: null });

  useEffect(() => {
    (async () => {
      const res = await bg<{ type: "AUTH_GET_TOKEN" }, { ok: boolean; data?: any; error?: string }>({ type: "AUTH_GET_TOKEN" });
      if (res.ok) setStatus({ isAuthenticated: Boolean(res.data?.token), token: res.data?.token ?? null });
    })();
  }, []);

  return (
    <div style={{ width: 340, padding: 12, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ margin: 0, fontSize: 14 }}>AIXORD Enforcement Platform</h1>
      <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
        Status: {status.isAuthenticated ? "Authenticated" : "Not authenticated"}
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          onClick={async () => {
            await bg({ type: "PING" });
            alert("pong");
          }}
        >
          Ping
        </button>

        <button
          onClick={async () => {
            await bg({ type: "AUTH_CLEAR_TOKEN" });
            setStatus({ isAuthenticated: false, token: null });
          }}
        >
          Clear Token
        </button>
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div style={{ fontSize: 12 }}>
        <div><b>Next:</b> hook adapters + enforcement engine.</div>
      </div>
    </div>
  );
}
