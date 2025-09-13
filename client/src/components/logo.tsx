import niloLogoPath from "@assets/Nailo_1753652288928.jpg";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-eduverse-blue rounded-lg flex items-center justify-center overflow-hidden`}>
        <img 
          src={niloLogoPath} 
          alt="EduVerse Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <div>
          <span className={`${textSizeClasses[size]} font-bold text-eduverse-blue`}>EDUVERSE</span>
          {size !== "sm" && (
            <p className="text-sm text-eduverse-gray">Education Excellence</p>
          )}
        </div>
      )}
    </div>
  );
}
