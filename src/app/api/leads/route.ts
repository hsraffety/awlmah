import { NextRequest, NextResponse } from "next/server";
import { Lead, LeadStatus, VisaCategory } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock database for leads - in a real app, this would be a database connection
let LEADS_DB: Lead[] = [
  {
    id: "1",
    firstName: "Jorge",
    lastName: "Ruiz",
    email: "jorge.ruiz@example.com",
    linkedIn: "https://linkedin.com/in/jorgeruiz",
    country: "Mexico",
    visaCategories: ["O-1"],
    additionalInfo: "Looking to move to the US for a tech job",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "2",
    firstName: "Bahar",
    lastName: "Zamir",
    email: "bahar.zamir@example.com",
    linkedIn: "https://linkedin.com/in/baharzamir",
    country: "Mexico",
    visaCategories: ["EB-1A", "O-1"],
    additionalInfo: "Entrepreneur looking to establish in the US",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "3",
    firstName: "Mary",
    lastName: "Lopez",
    email: "mary.lopez@example.com",
    linkedIn: "https://linkedin.com/in/marylopez",
    country: "Brazil",
    visaCategories: ["EB-2 NIW"],
    additionalInfo: "Researcher looking for opportunities in the US",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "4",
    firstName: "Li",
    lastName: "Zijin",
    email: "li.zijin@example.com",
    linkedIn: "https://linkedin.com/in/lizijin",
    country: "South Korea",
    visaCategories: ["O-1", "EB-1A"],
    additionalInfo: "Artist looking to work in the US",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "5",
    firstName: "Mark",
    lastName: "Antonov",
    email: "mark.antonov@example.com",
    linkedIn: "https://linkedin.com/in/markantonov",
    country: "Russia",
    visaCategories: ["EB-2 NIW"],
    additionalInfo: "Software engineer interested in US opportunities",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "6",
    firstName: "Jane",
    lastName: "Ma",
    email: "jane.ma@example.com",
    linkedIn: "https://linkedin.com/in/janema",
    country: "Mexico",
    visaCategories: ["I don't know"],
    additionalInfo: "Looking for visa options to study in the US",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "7",
    firstName: "Anand",
    lastName: "Jain",
    email: "anand.jain@example.com",
    linkedIn: "https://linkedin.com/in/anandjain",
    country: "Mexico",
    visaCategories: ["EB-1A"],
    additionalInfo: "Entrepreneur with a successful track record",
    status: LeadStatus.REACHED_OUT,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "8",
    firstName: "Anna",
    lastName: "Voronova",
    email: "anna.voronova@example.com",
    linkedIn: "https://linkedin.com/in/anavoronova",
    country: "France",
    visaCategories: ["O-1"],
    additionalInfo: "Researcher with publications in top journals",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  // Add more mock leads here for pagination demo
  {
    id: "9",
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "carlos.mendoza@example.com",
    linkedIn: "https://linkedin.com/in/carlosmendoza",
    country: "Mexico",
    visaCategories: ["EB-2 NIW"],
    additionalInfo: "Academic looking for US opportunities",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
  {
    id: "10",
    firstName: "Sophia",
    lastName: "Chen",
    email: "sophia.chen@example.com",
    linkedIn: "https://linkedin.com/in/sophiachen",
    country: "China",
    visaCategories: ["O-1"],
    additionalInfo: "Tech entrepreneur",
    status: LeadStatus.PENDING,
    createdAt: "2024-02-02T14:45:00Z",
  },
];

// GET handler to retrieve all leads
export async function GET(request: NextRequest) {
  // In a real app, you might filter by user access, sort, paginate, etc.
  return NextResponse.json({ success: true, data: LEADS_DB });
}

// POST handler to create a new lead
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const linkedIn = formData.get("linkedIn") as string;
    const visaCategoriesRaw = formData.get("visaCategories") as string;
    const additionalInfo = formData.get("additionalInfo") as string;

    // Optional file
    const resume = formData.get("resume") as File;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !country ||
      !linkedIn ||
      !visaCategoriesRaw
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse visa categories
    let visaCategories: VisaCategory[] = [];
    try {
      visaCategories = JSON.parse(visaCategoriesRaw) as VisaCategory[];
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid visa categories format" },
        { status: 400 }
      );
    }

    // Create new lead
    const newLead: Lead = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      country,
      linkedIn,
      visaCategories,
      additionalInfo,
      status: LeadStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    // In a real app, you would store the file and save its URL
    if (resume) {
      newLead.resumeUrl = "https://example.com/resumes/" + resume.name;
    }

    // Add to our mock database
    LEADS_DB.unshift(newLead);

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// PATCH handler to update lead status
export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(LeadStatus).includes(status)) {
      return NextResponse.json(
        { success: false, error: "Valid status is required" },
        { status: 400 }
      );
    }

    // Find and update the lead
    const leadIndex = LEADS_DB.findIndex((lead) => lead.id === id);

    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    // Update the lead status
    LEADS_DB[leadIndex].status = status;

    return NextResponse.json({
      success: true,
      data: LEADS_DB[leadIndex],
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
