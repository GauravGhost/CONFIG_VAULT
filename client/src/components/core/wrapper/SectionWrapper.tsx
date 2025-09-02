import React from "react";
import MyBreadcrumb, { type BreadcrumbData } from "@/components/core/MyBreadcrumb";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface SectionWrapperOptions {
  /** Custom className for the section element */
  sectionClassName?: string;
  /** Custom className for the content wrapper div */
  contentClassName?: string;
  /** Custom padding for the content area (defaults to "p-4") */
  contentPadding?: string;
  /** Whether to show the separator lines (defaults to true) */
  showSeparators?: boolean;
  /** Custom className for the breadcrumb wrapper */
  breadcrumbWrapperClassName?: string;
}

/**
 * SectionWrapper is a higher-order component that wraps pages with customizable styling and breadcrumbs.
 * @param id - The ID of the section
 * @param Component - The component to wrap
 * @param breadcrumbs - The breadcrumbs to display
 * @param breadcrumbActionComponent - Optional action component for breadcrumbs
 * @param options - Styling options for customization
 * @returns A wrapped component with section styling and breadcrumbs
 */
const SectionWrapper = <P extends object>(
  id: string,
  Component: React.ComponentType<P>,
  breadcrumbs: BreadcrumbData[],
  breadcrumbActionComponent?: React.ReactNode,
  options: SectionWrapperOptions = {}
) => {
  const {
    sectionClassName,
    contentClassName,
    contentPadding = "p-4",
    showSeparators = true,
    breadcrumbWrapperClassName
  } = options;

  const WrappedComponent = (props: P) => {
    return (
      <section 
        id={id} 
        className={cn("min-w-0 max-w-full overflow-hidden", sectionClassName)}
      >
        <div className={cn("min-w-0 max-w-full", breadcrumbWrapperClassName)}>
          {showSeparators && <Separator className="bg-muted h-0.5" />}
          <MyBreadcrumb items={breadcrumbs} actionComponent={breadcrumbActionComponent} />
          {showSeparators && <Separator className="bg-muted h-0.5" />}
        </div>
        <div className={cn("section-content min-w-0 max-w-full overflow-hidden", contentPadding, contentClassName)}>
          <Component {...props} />
        </div>
      </section>
    );
  };
  return WrappedComponent;
};

export default SectionWrapper;
