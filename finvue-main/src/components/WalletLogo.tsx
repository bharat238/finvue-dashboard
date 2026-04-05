import * as React from "react";

interface WalletLogoProps {
  className?: string;
  size?: number;
}

export function WalletLogo({ className = "", size = 36 }: WalletLogoProps) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-xl ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src="/wallet-icon.png"
        alt="FinVue"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to SVG if PNG not found
          (e.target as HTMLImageElement).src = '/wallet-icon.svg';
        }}
      />
    </div>
  );
}

export function WalletLogoSmall({ className = "", size = 24 }: WalletLogoProps) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-lg ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src="/wallet-icon.png"
        alt="FinVue"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to SVG if PNG not found
          (e.target as HTMLImageElement).src = '/wallet-icon.svg';
        }}
      />
    </div>
  );
}
