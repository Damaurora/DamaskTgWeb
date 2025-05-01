import { cn } from "@/lib/utils";

interface FireLogoProps {
  className?: string;
  size?: number;
  onClick?: () => void;
}

// A minimalist fire logo SVG component
export function FireLogo({ className, size = 24, onClick }: FireLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#FF6B00]", className, onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <path 
        d="M12 2C9.8 5.6 5 7.6 5 12.9C5 17.3 8.2 20.5 12 20.5C15.8 20.5 19 17.3 19 12.9C19 7.6 14.2 5.6 12 2Z" 
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M12 16.5C11.4 14.9 9.3 14 9.3 12.1C9.3 10.2 11.1 9.4 12 8.2" 
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default FireLogo;
