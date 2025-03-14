"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { LeadFormData, VisaCategory } from "@/types";
import { useRouter } from "next/navigation";

const VISA_CATEGORIES: VisaCategory[] = [
  "O-1",
  "EB-1A",
  "EB-2 NIW",
  "I don't know",
];
const COUNTRIES = [
  "United States",
  "Mexico",
  "Brazil",
  "South Korea",
  "Russia",
  "France",
  "India",
  "China",
  "Other",
];

export default function LeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LeadFormData, string>>
  >({});

  const [formData, setFormData] = useState<LeadFormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    linkedIn: "",
    visaCategories: [],
    additionalInfo: "",
  });

  const [fileSelected, setFileSelected] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.country) errors.country = "Country is required";
    if (!formData.linkedIn.trim())
      errors.linkedIn = "LinkedIn profile is required";
    if (formData.visaCategories.length === 0)
      errors.visaCategories = "Please select at least one visa category";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for this field when the user starts typing
    if (formErrors[name as keyof LeadFormData]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof LeadFormData];
        return newErrors;
      });
    }
  };

  const handleVisaCategoryChange = (category: VisaCategory) => {
    setFormData((prev) => {
      const newCategories = prev.visaCategories.includes(category)
        ? prev.visaCategories.filter((c) => c !== category)
        : [...prev.visaCategories, category];

      return { ...prev, visaCategories: newCategories };
    });

    // Clear the visa categories error when a selection is made
    if (formErrors.visaCategories) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.visaCategories;
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
      setFileSelected(true);
    } else {
      setFormData((prev) => {
        const newData = { ...prev };
        delete newData.resume;
        return newData;
      });
      setFileSelected(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create a FormData object to handle file upload
      const submission = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "visaCategories") {
          submission.append(key, JSON.stringify(value));
        } else if (key !== "resume") {
          submission.append(key, value as string);
        }
      });

      // Append the resume file if it exists
      if (formData.resume) {
        submission.append("resume", formData.resume);
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        body: submission,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Navigate to thank you page
      router.push("/assessment/thank-you");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <div className="p-8 bg-[#e7f0ca]">
        <div className="logo mb-6">
          <span className="text-2xl font-bold">almă</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Get An Assessment</h1>
        <h2 className="text-3xl font-bold mb-6">Of Your Immigration Case</h2>
      </div>

      <div className="p-8 bg-white">
        <div className="mb-6 flex items-center">
          <div className="w-8 h-8 bg-[#e0e7f7] rounded flex items-center justify-center mr-4">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              Want to understand your visa options?
            </h3>
            <p className="text-sm text-gray-600">
              Submit the form below and our team of experienced attorneys will
              review your information and send a preliminary assessment of your
              case based on your goals.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${formErrors.firstName ? "border-red-500" : "border-gray-300"}`}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${formErrors.lastName ? "border-red-500" : "border-gray-300"}`}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${formErrors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="country" className="block text-sm mb-1">
              Country of Citizenship
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${formErrors.country ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {formErrors.country && (
              <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="linkedIn" className="block text-sm mb-1">
              LinkedIn (Personal Website URL)
            </label>
            <input
              type="text"
              id="linkedIn"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${formErrors.linkedIn ? "border-red-500" : "border-gray-300"}`}
            />
            {formErrors.linkedIn && (
              <p className="text-red-500 text-xs mt-1">{formErrors.linkedIn}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#e0e0f7] rounded flex items-center justify-center mr-4">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">
                Visa categories of interest?
              </h3>
            </div>

            <div
              className={`space-y-2 ${formErrors.visaCategories ? "border border-red-500 p-2 rounded" : ""}`}
            >
              {VISA_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`visa-${category}`}
                    checked={formData.visaCategories.includes(category)}
                    onChange={() => handleVisaCategoryChange(category)}
                    className="mr-2"
                  />
                  <label htmlFor={`visa-${category}`}>{category}</label>
                </div>
              ))}
            </div>
            {formErrors.visaCategories && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.visaCategories}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#f5e0f7] rounded flex items-center justify-center mr-4">
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">How can we help you?</h3>
            </div>

            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={4}
              placeholder="What is your goal with immigration? Are you looking to stay short-term or work permanently? Do you have a specific timeline for your move, or any pressing considerations?"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="resume" className="block text-sm mb-2">
              Upload your resume/CV (optional)
            </label>
            <div className="border border-gray-300 rounded p-2">
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume"
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
              >
                {fileSelected ? (
                  <span className="text-green-600">File selected</span>
                ) : (
                  <span className="text-gray-500">
                    Click to upload or drag and drop
                  </span>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded font-medium disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
