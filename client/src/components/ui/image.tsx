import React from 'react'
import { cn } from "@/lib/utils"

export type ImageProps = {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  rounded?: boolean
  fallbackSrc?: string
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
  loading?: "eager" | "lazy"
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height" | "loading">

export function Image({
  src,
  alt,
  width,
  height,
  className,
  objectFit = "cover",
  rounded = false,
  fallbackSrc,
  onError,
  loading = "lazy",
  ...props
}: ImageProps) {
  const [imgSrc, setImgSrc] = React.useState<string>(src)
  const [hasError, setHasError] = React.useState<boolean>(false)

  React.useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
    onError?.(e)
  }

  const imageStyles: React.CSSProperties = {
    objectFit,
    width: width ?? "auto",
    height: height ?? "auto",
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(
        "max-w-full",
        rounded && "rounded-md",
        className
      )}
      style={imageStyles}
      loading={loading}
      onError={handleError}
      {...props}
    />
  )
}
