import { Slot, component$ } from '@khulnasoft.com/unisynth';
import {
  Link,
  useLocation,
  type LinkProps,
} from '@khulnasoft.com/unisynth-city';

type NavLinkProps = LinkProps & { activeClass?: string };

export const NavLink = component$(
  ({ activeClass, ...props }: NavLinkProps) => {
    const location = useLocation();
    const toPathname = props.href ?? '';
    const locationPathname = location.url.pathname;

    const startSlashPosition =
      toPathname !== '/' && toPathname.startsWith('/')
        ? toPathname.length - 1
        : toPathname.length;
    const endSlashPosition =
      toPathname !== '/' && toPathname.endsWith('/')
        ? toPathname.length - 1
        : toPathname.length;
    const isActive =
      locationPathname === toPathname ||
      (locationPathname.endsWith(toPathname) &&
        (locationPathname.charAt(endSlashPosition) === '/' ||
          locationPathname.charAt(startSlashPosition) === '/'));

    return (
      <Link
        {...props}
        class={`${props.class || ''} ${isActive ? activeClass : ''}`}
      >
        <Slot />
      </Link>
    );
  }
);
