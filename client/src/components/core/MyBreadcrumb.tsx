import * as React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Link } from "react-router"
import { Icon, type IconName } from "../ui/icon"

export type BreadcrumbData = {
    id: string | number
    label: string
    url?: string
    icon?: IconName
}

type MyBreadcrumbProps = {
    items: BreadcrumbData[]
    actionComponent?: React.ReactNode
}
function MyBreadcrumb({ items, actionComponent }: Readonly<MyBreadcrumbProps>) {
    return (
        <div className="flex items-center justify-between py-2 px-4 min-h-[50px] gap-2">
            <Breadcrumb className="flex-1 min-w-0">
                <BreadcrumbList className="flex items-center flex-wrap">
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={item?.url ?? "#"} className="flex items-center gap-1 text-sm">
                                        {item.icon && <Icon name={item.icon} className="h-3 w-3 sm:h-4 sm:w-4" />} 
                                        <span className="truncate">{item.label}</span>
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < items.length - 1 && <BreadcrumbSeparator className="mx-1" />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            {actionComponent && (
                <div className="flex items-center flex-shrink-0 ml-2">
                    {actionComponent}
                </div>
            )}
        </div>
    )
}

export default MyBreadcrumb
