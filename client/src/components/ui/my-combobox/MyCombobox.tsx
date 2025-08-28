import * as React from "react"
import { Check, ChevronsUpDown, Plus, X, Search, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export type ComboboxItem = {
  value: string
  label: string
  description?: string
  avatar?: string
  initials?: string
  metadata?: Record<string, unknown>
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export interface SimpleCreateConfig {
  type: 'simple'
  buttonText?: string
  onCreateItem: (searchValue: string) => ComboboxItem | Promise<ComboboxItem>
}

export interface FormCreateConfig {
  type: 'form'
  buttonText?: string
  dialogTitle?: string
  dialogDescription?: string
  formComponent: React.ComponentType<{
    onSuccess: (newItem: ComboboxItem) => void
    onCancel: () => void
    initialValue?: string
  }>
}

export type CreateConfig = SimpleCreateConfig | FormCreateConfig

interface MyComboboxProps {
  items: ComboboxItem[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  allowCreate?: boolean
  createConfig?: CreateConfig
  multiSelect?: boolean
  maxSelected?: number
  maxDisplayCount?: number
  renderItem?: (item: ComboboxItem, isSelected: boolean) => React.ReactNode
  renderSelectedItem?: (item: ComboboxItem) => React.ReactNode
  renderTrigger?: (selectedItems: ComboboxItem[], placeholder: string) => React.ReactNode
  showSearch?: boolean
  showSelectAll?: boolean
  selectAllText?: string
  clearAllText?: string
  onItemsChange?: (items: ComboboxItem[]) => void
  showClearAll?: boolean
}

export function MyCombobox({
  items,
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  disabled = false,
  allowCreate = false,
  createConfig,
  multiSelect = false,
  maxSelected,
  maxDisplayCount = 3,
  renderItem,
  renderSelectedItem,
  renderTrigger,
  showSearch = true,
  showSelectAll = false,
  selectAllText = "Select All",
  clearAllText = "Clear All",
  onItemsChange,
  showClearAll = true,
}: Readonly<MyComboboxProps>) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [localItems, setLocalItems] = React.useState<ComboboxItem[]>(items)
  const [isCreating, setIsCreating] = React.useState(false)

  React.useEffect(() => {
    setLocalItems(items)
  }, [items])

  const selectedValues = React.useMemo(() => {
    if (Array.isArray(value)) return value
    return value ? [value] : []
  }, [value])

  const selectedItems = React.useMemo(() => {
    return localItems.filter(item => selectedValues.includes(item.value))
  }, [localItems, selectedValues])

  const availableItems = React.useMemo(() => {
    return localItems.filter(item => !item.disabled)
  }, [localItems])

  const filteredItems = React.useMemo(() => {
    const itemsToFilter = searchValue ? localItems : localItems
    if (!searchValue) return itemsToFilter

    const search = searchValue.toLowerCase()
    return itemsToFilter.filter(item =>
      item.label.toLowerCase().includes(search) ||
      item.value.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search)
    )
  }, [localItems, searchValue])

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setOpen(true)
    } else if (event.key === "Backspace" && !event.currentTarget.value && selectedValues.length > 0) {
      const newSelectedValues = [...selectedValues]
      newSelectedValues.pop()
      onValueChange?.(Array.isArray(value) ? newSelectedValues : newSelectedValues[0] || "")
    }
  }

  const handleSelect = (itemValue: string) => {
    const item = localItems.find(i => i.value === itemValue)
    if (item?.disabled) return

    if (multiSelect || Array.isArray(value)) {
      const newValues = selectedValues.includes(itemValue)
        ? selectedValues.filter(v => v !== itemValue)
        : [...selectedValues, itemValue]

      if (maxSelected && newValues.length > maxSelected && !selectedValues.includes(itemValue)) {
        return
      }

      onValueChange?.(newValues)
    } else {
      onValueChange?.(itemValue)
      setOpen(false)
    }
    setSearchValue("")
  }

  const handleSelectAll = () => {
    if (selectedValues.length === availableItems.length) {
      onValueChange?.(Array.isArray(value) ? [] : "")
    } else {
      const allValues = availableItems.map(item => item.value)
      const valuesToSelect = maxSelected ? allValues.slice(0, maxSelected) : allValues
      onValueChange?.(valuesToSelect)
    }
  }

  const handleRemoveItem = (itemValue: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const newValues = selectedValues.filter(v => v !== itemValue)
    onValueChange?.(Array.isArray(value) ? newValues : newValues[0] || "")
  }

  const handleClearAll = () => {
    onValueChange?.(Array.isArray(value) ? [] : "")
  }

  const handleSimpleCreate = async () => {
    if (createConfig?.type === 'simple' && createConfig.onCreateItem && searchValue) {
      setIsCreating(true)
      try {
        const newItem = await createConfig.onCreateItem(searchValue)


        const updatedItems = [...localItems, newItem]
        setLocalItems(updatedItems)

        onItemsChange?.(updatedItems)

        if (multiSelect || Array.isArray(value)) {
          const newValues = [...selectedValues, newItem.value]
          onValueChange?.(newValues)
        } else {
          onValueChange?.(newItem.value)
          setOpen(false)
        }

        setSearchValue("")
      } catch (error) {
        console.error('Error creating item:', error)
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleFormCreate = () => {
    if (createConfig?.type === 'form') {
      setCreateDialogOpen(true)
      setOpen(false)
    }
  }

  const handleFormCreateSuccess = (newItem: ComboboxItem) => {
    const updatedItems = [...localItems, newItem]
    setLocalItems(updatedItems)

    onItemsChange?.(updatedItems)

    if (multiSelect || Array.isArray(value)) {
      const newValues = [...selectedValues, newItem.value]
      onValueChange?.(newValues)
    } else {
      onValueChange?.(newItem.value)
    }

    setCreateDialogOpen(false)
    setSearchValue("")
  }

  const handleFormCreateCancel = () => {
    setCreateDialogOpen(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const defaultRenderItem = (item: ComboboxItem, isSelected: boolean) => (
    <div className="flex items-center gap-3 w-full">
      {(multiSelect || Array.isArray(value)) && (
        <Checkbox
          checked={isSelected}
          className="shrink-0"
          aria-label={`Select ${item.label}`}
        />
      )}

      {(item.avatar || item.initials) && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={item.avatar} alt={item.label} />
          <AvatarFallback className="text-xs">
            {item.initials ?? getInitials(item.label)}
          </AvatarFallback>
        </Avatar>
      )}

      {item.icon && <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />}

      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium truncate",
          item.disabled && "text-muted-foreground"
        )}>
          {item.label}
        </div>
        {item.description && (
          <div className="text-sm text-muted-foreground truncate">
            {item.description}
          </div>
        )}
      </div>

      {!(multiSelect || Array.isArray(value)) && (
        <Check
          className={cn(
            "h-4 w-4 shrink-0",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  )

  const defaultRenderSelectedItem = (item: ComboboxItem) => (
    <div className="flex items-center gap-2">
      {(item.avatar || item.initials) && (
        <Avatar className="h-5 w-5">
          <AvatarImage src={item.avatar} alt={item.label} />
          <AvatarFallback className="text-xs">
            {item.initials ?? getInitials(item.label)}
          </AvatarFallback>
        </Avatar>
      )}
      {item.icon && <item.icon className="h-4 w-4" />}
      <span className="truncate">{item.label}</span>
    </div>
  )

  const getBadgeVariantClasses = () => {
    return "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }

  const defaultRenderTrigger = (selectedItems: ComboboxItem[], placeholder: string) => {
    if (selectedItems.length === 0) {
      return (
        <div className="flex items-center justify-between w-full">
          <span className="text-muted-foreground">{placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      )
    }

    if (multiSelect || Array.isArray(value)) {
      return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-1 mr-2">
            {selectedItems.length <= maxDisplayCount ? (
              selectedItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Badge
                    key={item.value}
                    className={cn(getBadgeVariantClasses())}
                  >
                    {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                    <span className="truncate max-w-24">
                      {renderSelectedItem ? renderSelectedItem(item) : item.label}
                    </span>
                    <XCircle
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveItem(item.value, e)
                      }}
                    />
                  </Badge>
                )
              })
            ) : (
              <Badge className={cn(getBadgeVariantClasses())}>
                {selectedItems.length} items selected
                <XCircle
                  className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearAll()
                  }}
                />
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showClearAll && selectedItems.length > 0 && (
              <>
                <X
                  className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearAll()
                  }}
                />
                <Separator orientation="vertical" className="h-4" />
              </>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 min-w-0">
          {renderSelectedItem ? renderSelectedItem(selectedItems[0]) : defaultRenderSelectedItem(selectedItems[0])}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </div>
    )
  }

  const allAvailableSelected = availableItems.length > 0 && selectedValues.length === availableItems.length

  const renderCreateButton = () => {
    if (!allowCreate || !searchValue || !createConfig) return null

    const buttonText = createConfig.buttonText ?? "Create"
    const handleCreate = createConfig.type === 'simple' ? handleSimpleCreate : handleFormCreate

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleCreate}
        disabled={isCreating}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        {isCreating ? "Creating..." : `${buttonText} "${searchValue}"`}
      </Button>
    )
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between min-h-10 h-auto p-2",
              selectedItems.length === 0 && "text-muted-foreground",
              className
            )}
          >
            {renderTrigger ? renderTrigger(selectedItems, placeholder) : defaultRenderTrigger(selectedItems, placeholder)}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
          sideOffset={4}
          style={{ width: 'var(--radix-popover-trigger-width)', minWidth: '200px' }}
        >
          <Command shouldFilter={false} className="w-full">
            {showSearch && (
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                />
              </div>
            )}

            {showSelectAll && (multiSelect || Array.isArray(value)) && availableItems.length > 0 && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={handleSelectAll}
                    className="flex items-center gap-2 px-4 py-2 font-medium"
                  >
                    <Checkbox
                      checked={allAvailableSelected}
                      className="shrink-0"
                    />
                    {allAvailableSelected ? clearAllText : selectAllText}
                  </CommandItem>
                </CommandGroup>
                <Separator />
              </>
            )}

            <ScrollArea className="w-full" onWheel={e => e.stopPropagation()}>
              <CommandList className="max-h-52 overflow-visible">
                {filteredItems.length === 0 ? (
                  <CommandEmpty>
                    <div className="flex flex-col items-center gap-2 p-4">
                      <p className="text-sm text-muted-foreground">{emptyText}</p>
                      {renderCreateButton()}
                    </div>
                  </CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredItems.map((item) => {
                      const isSelected = selectedValues.includes(item.value)
                      const isDisabled = item.disabled || (maxSelected && selectedValues.length >= maxSelected && !isSelected)

                      return (
                        <CommandItem
                          key={item.value}
                          value={item.label}
                          onSelect={() => !isDisabled && handleSelect(item.value)}
                          disabled={Boolean(isDisabled)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2",
                            isDisabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            {renderItem ? renderItem(item, isSelected) : defaultRenderItem(item, isSelected)}
                          </div>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </ScrollArea>

            {/* Bottom Actions */}
            {(multiSelect || Array.isArray(value)) && (
              <>
                <Separator />
                <CommandGroup>
                  <div className="flex items-center">
                    {selectedValues.length > 0 && (
                      <>
                        <CommandItem
                          onSelect={handleClearAll}
                          className="flex-1 justify-center cursor-pointer"
                        >
                          Clear All
                        </CommandItem>
                        <Separator orientation="vertical" className="h-6" />
                      </>
                    )}
                    <CommandItem
                      onSelect={() => setOpen(false)}
                      className="flex-1 justify-center cursor-pointer"
                    >
                      Close
                    </CommandItem>
                  </div>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Form Creation Dialog */}
      {createConfig?.type === 'form' && (
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {createConfig.dialogTitle ?? "Create New Item"}
              </DialogTitle>
              {createConfig.dialogDescription && (
                <DialogDescription>
                  {createConfig.dialogDescription}
                </DialogDescription>
              )}
            </DialogHeader>
            <createConfig.formComponent
              onSuccess={handleFormCreateSuccess}
              onCancel={handleFormCreateCancel}
              initialValue={searchValue}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default MyCombobox