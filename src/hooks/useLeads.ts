import { useState, useEffect, useCallback } from "react";
import { Lead, LeadFormData, LeadStatus } from "@/types";
import { handleApiResponse, createFormData } from "@/lib/api";

export default function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads");
      const data = await handleApiResponse<Lead[]>(response);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLead = useCallback(async (leadData: LeadFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = createFormData(leadData);
      const response = await fetch("/api/leads", {
        method: "POST",
        body: formData,
      });

      const newLead = await handleApiResponse<Lead>(response);
      setLeads((prev) => [newLead, ...prev]);
      return newLead;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead");
      console.error("Error creating lead:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLeadStatus = useCallback(
    async (id: string, status: LeadStatus) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/leads?id=${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        const updatedLead = await handleApiResponse<Lead>(response);

        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? updatedLead : lead))
        );

        return updatedLead;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update lead status"
        );
        console.error("Error updating lead status:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch leads when the hook is first used
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    isLoading,
    error,
    fetchLeads,
    createLead,
    updateLeadStatus,
  };
}
