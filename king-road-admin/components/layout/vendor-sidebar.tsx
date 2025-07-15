"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Store,
  Wallet,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Boxes,
  FolderTree,
} from "lucide-react";
import { useLanguage } from "../providers/language-provider";

export function VendorSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Products",
      href: "/products",
      icon: Package,
      badge: null,
    },
    {
      title: "Orders",
      href: "/orders",
      icon: ShoppingCart,
      badge: null,
    },
    // {
    //   title: "Customers",
    //   href: "/customers",
    //   icon: Users,
    //   badge: null,
    // },
    {
      title: "Categories",
      href: "/categories",
      icon: FolderTree,
      badge: null,
    },
    // {
    //   title: 'Settings',
    //   href: '/settings',
    //   icon: Settings,
    //   badge: null
    // }
  ];

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] bg-background border-r border-border/40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}

      <div className="flex flex-col h-full">
        <Link href="/" className="flex justify-center items-s gap-2 ">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-primary/80 rounded-lg flex items-center justify-center text-white font-bold">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-red-600">
              {language === "ar" ? "kingroad" : "kingroad"}
            </span>
            <span className="text-xs text-muted-foreground -mt-1">
              Dashboard
            </span>
          </div>
        </Link>
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      isCollapsed && "px-2 justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Help Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border/40">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Need Help?</p>
                  <p className="text-xs text-muted-foreground">Get support</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="/help">Contact Support</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
