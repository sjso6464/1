// App Router 版本 (app/api/generate-address/route.js)
export async function POST(request) {
  try {
    const response = await fetch('https://www.meiguodizhi.com/api/v1/dz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: '/hk-address',
        method: 'address'
      })
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}