import type { SVGProps } from "react";
import type { Social } from "@/lib/data";

type IconProps = SVGProps<SVGSVGElement>;

export function CameraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.6l1.5-2h6.8l1.5 2h1.6A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.8" />
    </svg>
  );
}

function VkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12.8 17.5C6.9 17.5 3.5 13.4 3.4 6.6h3c.1 5 2.3 7.1 4 7.5V6.6h2.8v4.3c1.7-.2 3.5-2.1 4.1-4.3h2.8a8.3 8.3 0 0 1-3.8 5.4 8.6 8.6 0 0 1 4.4 5.5h-3.1c-.6-2-2.3-3.6-4.4-3.8v3.8z" />
    </svg>
  );
}

function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.7 4.3 2.9 11.2c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 1.7 5.3c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.3-.5-1.8-1.4-1.4zM9 13.8l8.7-5.5c.4-.3.8-.1.5.2l-7.2 6.5-.3 3.1z" />
    </svg>
  );
}

const socialIcons = { vk: VkIcon, telegram: TelegramIcon };

export function SocialIcon({ name, ...props }: IconProps & { name: Social["icon"] }) {
  const Icon = socialIcons[name];
  return <Icon {...props} />;
}
