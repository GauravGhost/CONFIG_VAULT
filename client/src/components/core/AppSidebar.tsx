import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCallback, useMemo, useState, memo, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import Text from "../ui/text";
import { useSidebarItems } from "@/routes/sidebarMapping";
import { Icon, type IconName } from "../ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useTypewriter from "@/hooks/useTypewriter";

interface MenuItem {
  title: string;
  url: string;
  icon?: IconName;
  isActive?: boolean;
  children?: MenuItem[];
}

const MenuItemIcon = memo(
  ({
    name: iconName,
  }: {
    name: IconName;
  }) => <Icon name={iconName} className="h-4 w-4 min-h-4 min-w-4" />
);

const SubMenuItem = memo(
  ({
    child,
    isActive,
    onNavigate,
  }: {
    child: MenuItem;
    isActive: (url: string) => boolean;
    onNavigate: (url: string) => void;
  }) => (
    <SidebarMenuSubItem key={child.title}>
      <SidebarMenuSubButton
        onClick={() => onNavigate(child.url)}
        isActive={isActive(child.url)}
        className="cursor-pointer"
        asChild
      >
        <div className="flex items-center gap-4">
          {child.icon && <Icon name={child.icon} className="h-4 w-4 min-h-4 min-w-4" />}
          <Text>{child.title}</Text>
        </div>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
);

// Component for collapsed menu items with children
const CollapsedMenuItemWithChildren = memo(
  ({
    item,
    isActive,
    handleNavigate,
    openPopovers,
    setOpenPopovers,
  }: {
    item: MenuItem;
    isActive: (url: string) => boolean;
    handleNavigate: (url: string) => void;
    openPopovers: Record<string, boolean>;
    setOpenPopovers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  }) => (
    <Popover
      open={openPopovers[item.title] || false}
      onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [item.title]: open }))}
    >
      <PopoverTrigger asChild>
        <SidebarMenuButton
          isActive={isActive(item.url)}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {item.icon && <MenuItemIcon name={item.icon} />}
            <Text>{item.title}</Text>
          </div>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-56 p-2">
        <div className="space-y-1">
          <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
            {item.title}
          </div>
          {item.children?.map((child) => (
            <button
              key={child.title}
              onClick={() => handleNavigate(child.url)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${isActive(child.url) ? 'bg-accent text-accent-foreground' : ''
                }`}
            >
              {child.icon && <Icon name={child.icon} className="h-4 w-4" />}
              <span>{child.title}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
);

// Component for expanded menu items with children
const ExpandedMenuItemWithChildren = memo(
  ({
    item,
    isActive,
    isExpanded,
    toggleExpand,
    handleNavigate,
  }: {
    item: MenuItem;
    isActive: (url: string) => boolean;
    isExpanded: (title: string) => boolean;
    toggleExpand: (title: string) => void;
    handleNavigate: (url: string) => void;
  }) => (
    <>
      <SidebarMenuButton
        asChild
        onClick={() => toggleExpand(item.title)}
        isActive={isActive(item.url)}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {item.icon && <MenuItemIcon name={item.icon} />}
            <Text>{item.title}</Text>
          </div>
          {isExpanded(item.title) ? (
            <Icon name="ChevronDown" className="h-4 w-4 min-h-4 min-w-4 flex-shrink-0" />
          ) : (
            <Icon name="ChevronRight" className="h-4 w-4 min-h-4 min-w-4 flex-shrink-0" />
          )}
        </div>
      </SidebarMenuButton>

      {isExpanded(item.title) && (
        <SidebarMenuSub>
          {item.children?.map((child) => (
            <SubMenuItem
              key={child.title}
              child={child}
              isActive={isActive}
              onNavigate={handleNavigate}
            />
          ))}
        </SidebarMenuSub>
      )}
    </>
  )
);

// Component for menu items without children
const SimpleMenuItem = memo(
  ({
    item,
    isActive,
    handleNavigate,
  }: {
    item: MenuItem;
    isActive: (url: string) => boolean;
    handleNavigate: (url: string) => void;
  }) => (
    <SidebarMenuButton
      asChild
      onClick={() => handleNavigate(item.url)}
      isActive={isActive(item.url)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {item.icon && <MenuItemIcon name={item.icon} />}
        <Text>{item.title}</Text>
      </div>
    </SidebarMenuButton>
  )
);

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setOpenMobile } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});
  const { sidebarItems, footerActions } = useSidebarItems();

  const typewriterConfig = useMemo(() => ({
    text: "CONFIG VAULT",
    speed: 60,
    startDelay: 50
  }), []);

  const { displayText: titleText, setIsVisible: setTitleVisible } = useTypewriter(
    typewriterConfig.text,
    typewriterConfig.speed,
    typewriterConfig.startDelay
  );

  const updateTitleVisibility = useCallback(() => {
    setTitleVisible(state !== "collapsed");
  }, [state, setTitleVisible]);

  useEffect(() => {
    updateTitleVisibility();
  }, [updateTitleVisibility]);

  const toggleExpand = useCallback((title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  }, []);

  const isExpanded = useCallback(
    (title: string) => expandedItems.includes(title),
    [expandedItems]
  );

  const isActive = useCallback(
    (url: string) =>
      location.pathname === url ||
      (url !== "/" && location.pathname.startsWith(url)),
    [location.pathname]
  );

  const handleNavigate = useCallback(
    (url: string) => {
      navigate(url);
      setOpenPopovers({});
      setOpenMobile(false);
    },
    [navigate, setOpenMobile]
  );
  
  const { toggleSidebar } = useSidebar();
  const logoComponent = useMemo(
    () => {
      return (
          <Icon name="Vault" onClick={toggleSidebar} />
      );
    },
    [state]
  );

  const filteredSidebarItems = useMemo(() => {
    return sidebarItems.filter((item: MenuItem) => {
      if (item.isActive === false) {
        return false;
      }

      if (item.children) {
        const filteredChildren = item.children.filter((child: MenuItem) =>
          child.isActive !== false
        );
        if (filteredChildren.length === 0) return false;
        return { ...item, children: filteredChildren };
      }

      return true;
    }).map((item: MenuItem) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child: MenuItem) =>
            child.isActive !== false
          )
        };
      }
      return item;
    });
  }, [sidebarItems]);

  const menuItems = useMemo(
    () =>
      filteredSidebarItems.map((item: MenuItem) => {
        let menuContent;

        if (item.children) {
          if (state === "collapsed") {
            menuContent = (
              <CollapsedMenuItemWithChildren
                item={item}
                isActive={isActive}
                handleNavigate={handleNavigate}
                openPopovers={openPopovers}
                setOpenPopovers={setOpenPopovers}
              />
            );
          } else {
            menuContent = (
              <ExpandedMenuItemWithChildren
                item={item}
                isActive={isActive}
                isExpanded={isExpanded}
                toggleExpand={toggleExpand}
                handleNavigate={handleNavigate}
              />
            );
          }
        } else {
          menuContent = (
            <SimpleMenuItem
              item={item}
              isActive={isActive}
              handleNavigate={handleNavigate}
            />
          );
        }

        return (
          <SidebarMenuItem key={item.title}>
            {menuContent}
          </SidebarMenuItem>
        );
      }),
    [filteredSidebarItems, toggleExpand, isActive, isExpanded, handleNavigate, state, openPopovers]
  );

  const footerActionButtons = useMemo(
    () =>
      footerActions.map((action) => (
        <SidebarMenuItem key={action.title}>
          <SidebarMenuButton
            asChild
            className={`cursor-pointer ${action.variant === "destructive" ? "hover:text-destructive" : ""
              }`}
            onClick={action.onClick}
          >
            <div className="flex items-center gap-4">
              <Icon name={action.icon} className="h-4 w-4 min-h-4 min-w-4" />
              <Text>{action.title}</Text>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )),
    [footerActions]
  );

  const sidebarTriggerButton = useMemo(
    () => (
      <SidebarMenuItem>
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
      </SidebarMenuItem>
    ),
    []
  );
  return (
    <Sidebar collapsible="icon">
      <div className="flex gap-4 p-3 py-3">
        {logoComponent}
        {state !== "collapsed" && (
          <Link to="/">
            <Text
              variant="h4"
              className="min-w-0 font-mono"
            >
              {titleText}
            </Text>
          </Link>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{menuItems}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {sidebarTriggerButton}
          {footerActionButtons}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default memo(AppSidebar);
