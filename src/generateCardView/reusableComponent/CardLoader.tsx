import React, { memo } from "react";
import PropTypes from "prop-types";
import { CardLoaderProps } from "../InterfacesForCardView";

// 🎨 Theme mock (replace with your theme import)
const theme = {
  colors: {
    primary: "#3498db",
    primaryLight: "#85c1e9",
    muted: "#555",
  },
  borderRadius: {
    lg: "8px",
  },
};

/**
 * CardLoader Component
 *
 * Flexible, reusable loader with multiple variants.
 */
const CardLoader: React.FC<CardLoaderProps> = ({
  size = "medium",
  variant = "spinner",
  overlay = true,
  message = "Loading...",
  className = "",
  style = {},
}) => {
  // 🔹 Size options
  const sizeMap = {
    small: { container: 24, stroke: 3 },
    medium: { container: 32, stroke: 4 },
    large: { container: 48, stroke: 5 },
  };

  const { container, stroke } = sizeMap[size] || sizeMap.medium;

  // 🔹 Variants
  const Spinner = memo(() => (
    <div
      style={{
        width: `${container}px`,
        height: `${container}px`,
        border: `${stroke}px solid ${theme.colors.primaryLight}`,
        borderTop: `${stroke}px solid ${theme.colors.primary}`,
        borderRadius: "50%",
        animation: "spin 1s ease-in-out infinite",
      }}
    />
  ));

  const Dots = memo(() => (
    <div style={{ display: "flex", gap: "4px" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: `${container / 3}px`,
            height: `${container / 3}px`,
            borderRadius: "50%",
            backgroundColor: theme.colors.primary,
            animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }}
        />
      ))}
    </div>
  ));

  const Bars = memo(() => (
    <div style={{ display: "flex", gap: "2px", width: `${container}px` }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${container}px`,
            backgroundColor: theme.colors.primary,
            animation: `stretch 1.2s ease-in-out ${i * 0.1}s infinite both`,
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  ));

  const PulseCircle = memo(() => (
    <div
      style={{
        width: `${container}px`,
        height: `${container}px`,
        borderRadius: "50%",
        backgroundColor: theme.colors.primary,
        animation: "pulse 1.5s ease-in-out infinite both",
      }}
    />
  ));

  const LoaderComponent =
    {
      spinner: Spinner,
      dots: Dots,
      bars: Bars,
      "pulse-circle": PulseCircle,
    }[variant] || Spinner;

  return (
    <div
      role="status"
      aria-live="polite"
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlay ? "rgba(255, 255, 255, 0.9)" : "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.borderRadius.lg,
        zIndex: 10,
        backdropFilter: overlay ? "blur(2px)" : "none",
        ...style,
      }}
    >
      <LoaderComponent />
      {message && (
        <p
          style={{
            marginTop: "12px",
            color: theme.colors.muted,
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes stretch {
          0%, 40%, 100% { transform: scaleY(0.5); }
          20% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

// 🔹 Prop validation
CardLoader.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]) as any,
  variant: PropTypes.oneOf(["spinner", "dots", "bars", "pulse-circle"]) as any,
  overlay: PropTypes.bool,
  message: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};


export default CardLoader;
