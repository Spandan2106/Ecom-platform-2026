import React from "react";

export default function Skeleton({ width, height, borderRadius = "4px", style }) {
  return (
    <div
      style={{
        width: width || "100%",
        height: height || "20px",
        backgroundColor: "#e0e0e0",
        borderRadius: borderRadius,
        animation: "skeleton-loading 1.5s infinite linear",
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
    />
  );
}