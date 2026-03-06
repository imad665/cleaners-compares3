"use client";

import { useState } from "react";

export default function MessagesLayout({ conversations }: any) {
  const [active, setActive] = useState(null);

  return (
    <div className="flex h-[calc(100vh-80px)] border rounded-xl overflow-hidden">

      {/* LEFT SIDEBAR */}
      <div className="w-80 border-r bg-muted/30 overflow-y-auto">
        {conversations.map((conv: any, i: number) => (
          <div
            key={i}
            onClick={() => setActive(conv)}
            className="p-4 border-b cursor-pointer hover:bg-muted transition"
          >
            <div className="flex justify-between">
              <p className="font-semibold text-sm truncate">
                {conv.productName}
              </p>
              {conv.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {conv.unreadCount}
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {conv.buyerName}
            </p>

            <p className="text-xs truncate mt-1 text-muted-foreground">
              {conv.lastMessage}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE (Messages Placeholder) */}
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        {active ? (
          <div>
            <h2 className="text-lg font-semibold">{active.productName}</h2>
            <p>{active.buyerName}</p>
          </div>
        ) : (
          <p>Select a conversation</p>
        )}
      </div>
    </div>
  );
}