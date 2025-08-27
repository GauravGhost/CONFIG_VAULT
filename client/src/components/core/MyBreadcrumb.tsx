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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 px-4">
            <Breadcrumb>
                <BreadcrumbList className="flex items-center flex-wrap">
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={item?.url ?? "#"} className="flex items-center gap-1">
                                        {item.icon && <Icon name={item.icon} className="h-4 w-4" />} 
                                        {item.label}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < items.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            {actionComponent && (
                <div className="flex items-center">
                    {actionComponent}
                </div>
            )}
        </div>
    )
}

export default MyBreadcrumb
