import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
} from '@khulnasoft.com/unisynth';

interface TodosStore {
  items: string[];
}
export const todosContext = createContextId<TodosStore>('Todos');
export default component$(() => {
  useContextProvider(
    todosContext,
    useStore<TodosStore>({
      items: ['Learn Unisynth', 'Build Unisynth app', 'Profit'],
    })
  );

  return <Items />;
});

export const Items = component$(() => {
  // replace this with context retrieval.
  const todos = { items: [] };
  return (
    <ul>
      {todos.items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
});
