import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      organisation,
      item,
      quantity,
      urgency,
      location,
    } = body;

    if (
      !organisation ||
      !item ||
      !quantity ||
      !urgency ||
      !location
    ) {
      return Response.json(
        {
          error: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("needs")
      .insert({
        organisation,
        item,
        quantity,
        urgency,
        location,
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return Response.json(
        {
          error: "Failed to save need",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        message: "Need saved successfully",
        need: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("needs")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return Response.json(
      {
        error: "Failed to fetch needs",
      },
      {
        status: 500,
      }
    );
  }

  return Response.json({
    needs: data,
  });
}