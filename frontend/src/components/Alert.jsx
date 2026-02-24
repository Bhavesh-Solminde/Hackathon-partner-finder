import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const Alert = ({ type = "error", children, className = "" }) => {
  const variants = {
    error: {
      container: "bg-red-500/10 border-red-500/30 text-red-400",
      icon: <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
    },
    success: {
      container: "bg-green-500/10 border-green-500/30 text-green-400",
      icon: <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
    },
    info: {
      container: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      icon: <Info className="w-4 h-4 mt-0.5 shrink-0" />
    }
  };

  const variant = variants[type] || variants.error;

  return (
    <div className={`p-3 border rounded flex items-start gap-2 text-sm ${variant.container} ${className}`}>
      {variant.icon}
      <span>{children}</span>
    </div>
  );
};

export default Alert;
