"use client";

import React, { useState } from "react";
import {
  Home,
  User,
  Lightbulb,
  Gamepad2,
  Bot,
  Trophy,
  ChevronLeft,
  Search,
  LogOut,
} from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface SidebarItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isActive?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/app", isActive: true },
  { icon: Lightbulb, label: "Incubator", href: "/app/incubator" },
  { icon: Gamepad2, label: "Games", href: "/app/games" },
  { icon: Bot, label: "AI Tools", href: "/app/ai-tools" },
  { icon: Trophy, label: "Quests", href: "/app/quests" },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { logout, authenticated, user } = usePrivy();

  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-black border-r border-gray-900
        transition-all duration-300 ease-in-out z-50
        ${isExpanded ? "w-56 rounded-r-xl" : "w-16"}
        group hover:w-56 hover:rounded-r-xl
        flex flex-col
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {" "}
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-900">
        {/* Logo - always visible */}
        <div className="flex items-center space-x-3 pt-6">
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Wagus Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span
            className={`
              text-white font-semibold text-lg transition-opacity duration-300
              ${
                isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }
            `}
          >
            Wagus
          </span>
        </div>
      </div>
      {/* Navigation Items */}
      <nav className="flex-1 px-2 flex items-center justify-center">
        <ul className="space-y-2 w-full">
          {sidebarItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-all duration-200 group/item
                    ${
                      item.isActive
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-gray-900 hover:text-white"
                    }
                  `}
                >
                  <IconComponent
                    className={`
                      w-5 h-5 flex-shrink-0 transition-all duration-200
                      ${
                        item.isActive
                          ? "text-white"
                          : "text-gray-400 group-hover/item:text-white"
                      }
                    `}
                  />
                  <span
                    className={`
                      ml-3 font-medium transition-all duration-300
                      ${
                        isExpanded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {/* Tooltip for collapsed state */}
                  <div
                    className={`
                    absolute left-16 px-2 py-1 bg-gray-900 text-white text-sm rounded-md
                    opacity-0 pointer-events-none transition-opacity duration-200
                    ${
                      !isExpanded
                        ? "group-hover/item:opacity-100 group-hover:opacity-0"
                        : "hidden"
                    }
                  `}
                  >
                    {item.label}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>{" "}      {/* Profile Section */}
      <div className="p-4 border-t border-gray-900">
        <div
          className={`
          flex items-center transition-all duration-300
          ${isExpanded ? "space-x-3" : "justify-center"}
        `}
        >
          {/* Avatar - always visible */}
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-blue-500">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          {/* Profile info - only visible when expanded */}
          <div
            className={`
              flex-1 min-w-0 transition-opacity duration-300
              ${
                isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }
            `}
          >
            {authenticated && user ? (
              <>
                <p className="text-sm font-medium text-white truncate">
                  {user.email?.address ? `[${user.email.address.split('@')[0]}]` : '[user]'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.wallet?.address 
                    ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                    : 'No wallet'
                  }
                </p>
                <button
                  onClick={logout}
                  className="cursor-pointer mt-2 flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-white truncate">
                  [username]
                </p>
                <p className="text-xs text-gray-400 truncate">[address]</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
