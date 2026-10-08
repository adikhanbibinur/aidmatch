export async function POST(request: Request) {
  const body = await request.json();

  console.log("Donation received by backend:", body);

  return Response.json(
    {
      message: "Donation received successfully",
      donation: {
        id: Date.now(),
        ...body,
      },
    },
    {
      status: 201,
    }
  );
}