"use client";

import { useEffect, useState } from "react";
import { Lead, LeadStatus } from "@/types";
import LeadItem from "./LeadItem";

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads");
        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data = await response.json();
        setLeads(data.data || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setError("Failed to load leads. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lead status");
      }

      // Update the leads list in the UI
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead,
        ),
      );
    } catch (error) {
      console.error("Error updating lead status:", error);
      throw error;
    }
  };

  // Filter leads based on search query and status filter
  const filteredLeads = leads
    .filter((lead) => {
      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
    .filter((lead) => {
      if (!statusFilter) return true;
      return lead.status === statusFilter;
    });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded"
          />
          <div className="absolute left-3 top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">All Statuses</option>
            <option value={LeadStatus.PENDING}>{LeadStatus.PENDING}</option>
            <option value={LeadStatus.REACHED_OUT}>
              {LeadStatus.REACHED_OUT}
            </option>
            <option value={LeadStatus.COMPLETED}>{LeadStatus.COMPLETED}</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Submitted
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Country
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead) => (
                <LeadItem
                  key={lead.id}
                  lead={lead}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &lt;
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNumber =
              currentPage > 3
                ? currentPage + i > totalPages
                  ? totalPages - 4 + i
                  : currentPage - 2 + i
                : i + 1;

            return pageNumber <= totalPages ? (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1 border rounded ${
                  currentPage === pageNumber ? "bg-gray-200" : ""
                }`}
              >
                {pageNumber}
              </button>
            ) : null;
          })}

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
