import React from "react";
import Image from "next/image";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGE_SIZES, type ImageVariant } from "@/constants/images";
import { getOptimizedImageUrl } from "@/lib/image";

interface BlogImageProps {
  src: string;
  alt: string;
  variant: ImageVariant;
  priority?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<ImageVariant, string> = {
  cover: "aspect-[1200/630] w-full",
  card: "aspect-[800/420] w-full",
  thumb: "h-12 w-12 shrink-0",
};

const BlogImage = ({
  src,
  alt,
  variant,
  priority,
  className,
}: BlogImageProps) => {
  const size = IMAGE_SIZES[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {src ? (
        <Image
          src={getOptimizedImageUrl(src, size)}
          alt={alt}
          width={size.width}
          height={size.height}
          priority={priority}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <FileText className="h-6 w-6 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default BlogImage;
