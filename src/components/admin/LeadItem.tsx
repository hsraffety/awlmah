"use client";

import { Lead, LeadStatus } from "@/types";
import { useState } from "react";

interface LeadItemProps {
  lead: Lead;
  onStatusChange: (id: string, newStatus: LeadStatus) => Promise<void>;
}

export default function LeadItem({ lead, onStatusChange }: LeadItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    if (lead.status === LeadStatus.PENDING) {
      setIsUpdating(true);
      try {
        await onStatusChange(lead.id, LeadStatus.REACHED_OUT);
      } catch (error) {
        console.error("Error updating lead status:", error);
        alert("Failed to update lead status. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Format date for display
  const formattedDate = new Date(lead.createdAt).toLocaleString();

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-4 px-6">
        {lead.firstName} {lead.lastName}
      </td>
      <td className="py-4 px-6">{formattedDate}</td>
      <td className="py-4 px-6">
        <span
          className={`px-2 py-1 rounded text-sm ${
            lead.status === LeadStatus.PENDING
              ? "bg-yellow-100 text-yellow-800"
              : lead.status === LeadStatus.REACHED_OUT
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {lead.status}
        </span>
      </td>
      <td className="py-4 px-6">{lead.country}</td>
      <td className="py-4 px-6">
        {lead.status === LeadStatus.PENDING ? (
          <button
            onClick={handleStatusChange}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isUpdating ? "Updating..." : "Mark as Reached Out"}
          </button>
        ) : null}
      </td>
    </tr>
  );
}
