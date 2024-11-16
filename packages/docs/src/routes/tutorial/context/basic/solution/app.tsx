import {
  component$,
  createContextId,
  useContextProvider,
  useContext,
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
  const todos = useContext(todosContext);
  return (
    <ul>
      {todos.items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
});
