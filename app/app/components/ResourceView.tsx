import React from "react";

interface ResourceViewProps {
  title: string;
  link: string;
}

export default function ResourceView({ title, link }: ResourceViewProps) {
  return (
    <div className="card bg-base-200 shadow-md no-underline h-full transition-transform duration-200 hover:-translate-y-1">
      <div className="card-body">
        <h4 className="card-title mt-0">{title}</h4>
        <span className="text-xs font-light text-gray-500">{link}</span>
      </div>
    </div>
  );
}
