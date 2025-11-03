import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    // Revalidate the repositories data
    revalidatePath("/api/repositories");
    revalidatePath("/"); // Also revalidate the home page

    return NextResponse.json({
      success: true,
      message: "Repository data revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating repositories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revalidate repository data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
