"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  dates: string;
  location: string;
  image?: string;
  images?: readonly string[];
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
}

function VentureCardComponent({
  title,
  description,
  dates,
  location,
  image,
  images,
  links,
}: Props) {
  const [showImages, setShowImages] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const hasImages = images && images.length > 0;
  const hasExpandable = (description?.length ?? 0) > 0 || hasImages;

  const toggleExpand = () => {
    if (hasExpandable) {
      setShowImages((prev) => !prev);
    }
  };

  const handleImageError = (src: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  return (
    <li
      className={cn(
        "relative ml-10 py-4 group",
        hasExpandable ? "cursor-pointer" : "cursor-default"
      )}
      onClick={toggleExpand}
      role={hasExpandable ? "button" : undefined}
      tabIndex={hasExpandable ? 0 : undefined}
      onKeyDown={(e) => {
        if (hasExpandable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          toggleExpand();
        }
      }}
    >
      <div className="absolute -left-16 top-2 flex items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-[var(--glass-shadow)]">
        <Avatar className="border border-[var(--glass-border)] size-12 m-auto">
          <AvatarImage src={image} alt={`${title} logo`} className="object-contain" />
          <AvatarFallback aria-label={title}>{title[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1">
        {dates && (
          <time className="text-xs text-muted-foreground">{dates}</time>
        )}
        <div className="inline-flex items-center gap-1.5 font-semibold leading-none">
          {title}
          {hasExpandable && (
            <ChevronRight
              className={cn(
                "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                showImages ? "rotate-90" : "rotate-0"
              )}
            />
          )}
        </div>
        {location && (
          <p className="text-sm text-muted-foreground">{location}</p>
        )}
        {hasExpandable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: showImages ? 1 : 0,
              height: showImages ? "auto" : 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-3 overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {description && (
              <span className="prose dark:prose-invert text-sm text-muted-foreground block mb-3">
                {description}
              </span>
            )}
            {hasImages && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {images!.map((src, idx) => (
                  !failedImages.has(src) && (
                    <div
                      key={idx}
                      className="block aspect-video rounded-[var(--radius)] border border-[var(--glass-border)] overflow-hidden bg-muted/50 w-full"
                      role="img"
                      aria-label={`${title} image ${idx + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`${title} portfolio image ${idx + 1}`}
                        width={640}
                        height={360}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(src)}
                      />
                    </div>
                  )
                ))}
              </div>
            )}
          </motion.div>
        )}
        {links && links.length > 0 && (
          <div
            className="mt-2 flex flex-row flex-wrap items-start gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {links?.map((link, idx) => (
              <Link href={link.href} key={idx}>
                <Badge key={idx} title={link.title} className="flex gap-2">
                  {link.icon}
                  {link.title}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

export const VentureCard = React.memo(VentureCardComponent);
