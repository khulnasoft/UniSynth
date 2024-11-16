import { type UnisynthIntrinsicElements, Slot, component$ } from '@khulnasoft.com/unisynth';

type ButtonProps = UnisynthIntrinsicElements['button'] & {
  theme?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'github';
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'contained';
};

/**
 * Todos:
 *
 * - Implement sizes
 * - Implement themes
 * - Implement variants
 */

export default component$<ButtonProps>((props) => {
  return (
    <button
      {...props}
      class={[
        'button',
        props.theme === 'primary' && 'border-slate-300 bg-white  text-black',
        props.theme === 'github' && 'bg-black text-white',
      ]}
    >
      <Slot />
    </button>
  );
});
