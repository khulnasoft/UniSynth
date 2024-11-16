import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ html }) => {
  html(
    200,
    `
      <form id="myForm" method="POST">
        <input type="text" name="project" value="Unisynth"/>
        <input type="text" name="url" value="http://unisynth.dev"/>
      </form>
      <script>myForm.submit()</script>`
  );
};

export const onPost: RequestHandler = async ({ parseBody, json }) => {
  json(200, { body: await parseBody() });
};
