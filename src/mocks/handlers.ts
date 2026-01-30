import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Vercel AI SDK completion endpoint
  http.post('/api/completion', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const text = "할 수 있다고 믿는다면, 이미 절반은 해낸 것입니다. 작은 저축이 모여 큰 꿈을 이룹니다. 오늘도 화이팅하세요!";
        const chunks = text.split(' ');

        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk + ' '));
          await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate typing
        }
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }),
];
