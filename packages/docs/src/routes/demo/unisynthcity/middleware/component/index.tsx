import { component$ } from '@khulnasoft.com/unisynth';
import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onRequest: RequestHandler = async ({ redirect }) => {
  if (!isLoggedIn()) {
    throw redirect(308, '/login');
  }
};

export default component$(() => {
  return <div>You are logged in.</div>;
});

function isLoggedIn() {
  return true; // Mock login as true
}
