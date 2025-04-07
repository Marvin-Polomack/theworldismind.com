import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Check, AlertTriangle, CircleHelp, ExternalLink } from "lucide-react";
import { FactCheckResult } from "@/types/fact-check";

const factCheckBubbleVariants = cva(
  "group relative break-words rounded-lg p-3 text-sm bg-gradient-to-br border",
  {
    variants: {
      status: {
        factual: "from-green-100 to-green-50 border-green-200 text-green-800",
        questionable: "from-amber-100 to-amber-50 border-amber-200 text-amber-800",
        uncertain: "from-slate-100 to-slate-50 border-slate-200 text-slate-800",
      },
      animation: {
        none: "",
        slide: "duration-300 animate-in fade-in-0 slide-in-from-left",
        scale: "duration-300 animate-in fade-in-0 zoom-in-75 origin-bottom-left",
        fade: "duration-500 animate-in fade-in-0",
      },
    },
    defaultVariants: {
      status: "uncertain",
      animation: "slide",
    },
  }
);

type Animation = VariantProps<typeof factCheckBubbleVariants>["animation"];
type Status = VariantProps<typeof factCheckBubbleVariants>["status"];

export interface FactCheckBubbleProps {
  factCheckResult: FactCheckResult;
  animation?: Animation;
  className?: string;
}

export function FactCheckBubble({
  factCheckResult,
  animation = "slide",
  className,
}: FactCheckBubbleProps) {
  // Determine status based on claims
  const getOverallStatus = (): Status => {
    if (!factCheckResult.contains_claims) return "uncertain";
    
    // Count claims by status - handle both boolean and string values for is_factual
    const claimStatuses = factCheckResult.claims.map(claim => {
      // Handle both string and boolean values for is_factual
      const isFactual = typeof claim.is_factual === 'string' 
        ? claim.is_factual === 'true'
        : claim.is_factual === true;
      
      const isNotFactual = typeof claim.is_factual === 'string'
        ? claim.is_factual === 'false'
        : claim.is_factual === false;
      
      return isFactual ? "factual" : 
             isNotFactual ? "questionable" : 
             "uncertain";
    });
    
    // If any claim is not factual, the whole message is questionable
    if (claimStatuses.includes("questionable")) return "questionable";
    // If all claims are factual, the whole message is factual
    if (claimStatuses.every(status => status === "factual")) return "factual";
    // Otherwise, it's uncertain
    return "uncertain";
  };

  const status = getOverallStatus();
  
  const StatusIcon = () => {
    switch (status) {
      case "factual":
        return <Check className="h-4 w-4 text-green-600" />;
      case "questionable":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "uncertain":
      default:
        return <CircleHelp className="h-4 w-4 text-slate-600" />;
    }
  };

  // Check if a string is a URL
  const isUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Render sources as links when possible
  const renderSources = (sources?: string[], sourcesLabel?: string) => {
    if (!sources || sources.length === 0) return null;
    
    // Default to 'Sources' if no label provided
    const label = sourcesLabel || "Sources";
    
    return (
      <div className="mt-1 text-xs">
        <div className="font-medium mb-1">{label}:</div>
        <ul className="list-disc pl-4 space-y-1">
          {sources.map((source, idx) => (
            <li key={idx} className="break-words">
              {isUrl(source) ? (
                <a 
                  href={source} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-blue-600 hover:underline"
                >
                  {source.length > 50 ? `${source.substring(0, 50)}...` : source}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ) : (
                source
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div
      className={cn(factCheckBubbleVariants({ status, animation }), className)}
    >
      <div className="flex items-center gap-2 mb-1 font-medium">
        <StatusIcon />
      </div>
      
      <div className="text-sm">
        {factCheckResult.summary}
      </div>
      
      {factCheckResult.contains_claims && factCheckResult.claims.length > 0 && (
        <div className="mt-2 space-y-2">
          {factCheckResult.claims.map((claim, index) => (
            <div key={index} className="text-xs border-l-2 pl-2 mt-1" 
              style={{ 
                borderColor: claim.is_factual ? '#16a34a' : 
                             claim.is_factual === false ? '#d97706' : '#64748b' 
              }}
            >
              <div className="font-medium">{claim.claim}</div>
              <div>{claim.explanation}</div>
              {renderSources(claim.sources, claim.sources_label)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 