import React from "react";
import MyBreadcrumb, { type BreadcrumbData } from "@/components/core/MyBreadcrumb";
import { Separator } from "@/components/ui/separator";

/**
 * SectionWrapper is a higher-order component that wraps pages with default padding and breadcrumbs.
 * @param id - The ID of the section
 * @param Component - The component to wrap
 * @param breadcrumbs - The breadcrumbs to display
 * @returns A wrapped component with section styling and breadcrumbs
 */
const SectionWrapper = <P extends object>(
  id: string,
  Component: React.ComponentType<P>,
  breadcrumbs: BreadcrumbData[],
  breadcrumbActionComponent?: React.ReactNode
) => {
  const WrappedComponent = (props: P) => {
    return (
      <section id={id} className="min-w-0 max-w-full overflow-hidden">
        <div className="min-w-0 max-w-full">
          <Separator className="bg-muted h-0.5" />
          <MyBreadcrumb items={breadcrumbs} actionComponent={breadcrumbActionComponent} />
          <Separator className="bg-muted h-0.5" />
        </div>
        <div className="p-4 section-content min-w-0 max-w-full overflow-hidden">
          <Component {...props} />
        </div>
      </section>
    );
  };
  return WrappedComponent;
};

export default SectionWrapper;
