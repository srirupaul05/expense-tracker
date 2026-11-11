import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(req, { params }) {
  const size = Math.min(Math.max(parseInt(params.size) || 192, 48), 1024);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#4f46e5",
        color: "#ffffff",
        fontSize: size * 0.55,
        fontWeight: 700,
      }}
    >
      S
    </div>,
    { width: size, height: size },
  );
}
