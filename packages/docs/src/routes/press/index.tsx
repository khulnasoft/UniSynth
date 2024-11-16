import { component$, $, useSignal } from '@khulnasoft.com/unisynth';
import UnisynthLogo from '/public/logos/unisynth.png?jsx';
import UnisynthLogouwu from '/public/logos/unisynth-uwu.webp?jsx';
import UnisynthSocial from '/public/logos/social-card.png?jsx';
import UnisynthSocial2 from '/public/logos/social-card.jpg?jsx';
import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';
import { Slot } from '@khulnasoft.com/unisynth';
const DownloadButton = component$((props: { href: string | undefined }) => {
  return (
    <a
      class="
          flex justify-between items-center py-0 px-2 my-0 mx-4 h-8 font-medium text-center  border-2 border-solid cursor-pointer select-none border-sky-500     text-sky-500 w-fit self-center rounded-md "
      href={props.href ?? '/logos/unisynth.png'}
      download
    >
      <p class="hover:underline"> Download</p>{' '}
    </a>
  );
});

export default component$(() => {
  const activeColor = useSignal<string>('');

  const color = {
    unisynthBlue: '#009dfd',
    unisynthDarkBlue: '#006ce9',
    unisynthLightBlue: '#daf0ff',
    unisynthPurple: '#ac7ef4',
    unisynthDarkPurple: '#6000ff',
    unisynthDarkPurpleBg: '#151934',
  } as const;

  const copyToClipboard = $(async (text: string) => {
    try {
      if (!navigator.clipboard) {
        activeColor.value = text;
        return;
      }
      await navigator.clipboard.writeText(text);
      activeColor.value = text;
      const rs = setTimeout(() => {
        const old = activeColor.value;
        if (old === text) {
          activeColor.value = '';
        }
      }, 1500);
      return () => clearTimeout(rs);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });

  const logos = [
    {
      title: 'Unisynth Logo (png)',
      alt: 'Unisynth Logo in PNG format',
      downloadHref: '/logos/unisynth.png',
      Logo: UnisynthLogo,
    },
    {
      title: 'Unisynth Logo (svg)',
      alt: 'Unisynth Logo in SVG format',
      downloadHref: '/logos/unisynth.svg',
      Logo: 'img',
      src: '/logos/unisynth.svg',
    },
    {
      title: 'Unisynth Logo (uwu)',
      alt: 'Unisynth Logo in UWU format',
      downloadHref: '/logos/unisynth-uwu.webp',
      Logo: UnisynthLogouwu,
      className: 'h-auto w-auto object-contain',
    },
    {
      title: 'Unisynth social card Light',
      alt: 'Unisynth Social Card in Light theme',
      downloadHref: '/logos/social-card.png',
      Logo: UnisynthSocial,
    },
    {
      title: 'Unisynth social card Dark',
      alt: 'Unisynth Social Card in Dark theme',
      downloadHref: '/logos/social-card.jpg',
      Logo: UnisynthSocial2,
    },
  ];
  const downloadAllAssets = $(() => {
    const links = [
      '/logos/unisynth.png',
      '/logos/unisynth.svg',
      '/logos/unisynth-uwu.webp',
      '/logos/social-card.png',
      '/logos/social-card.jpg',
    ];

    links.forEach((link) => {
      const anchor = document.createElement('a');
      anchor.href = link;
      anchor.download = link.split('/').pop() as string;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    });
  });

  const Logo = component$((props: { title: string; alt: string; downloadHref: string }) => {
    return (
      <div class="flex flex-col justify-between h-72 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <p class="text-2xl font-bold text-center py-4 ">{props.title}</p>
        <div class="flex-grow flex items-center justify-center overflow-hidden px-2">
          <Slot name="logo" />
        </div>
        <div class="flex justify-center mt-auto py-4">
          <DownloadButton href={props.downloadHref} />
        </div>
      </div>
    );
  });

  const ColorButton = component$(
    (props: { color: string; name: string; hexCode: string; text: string | undefined }) => {
      return (
        <button
          onClick$={() => copyToClipboard(props.hexCode)}
          style={`background-color:${props.color};`}
          class="flex justify-center text-white items-center cursor-pointer h-12  "
        >
          {activeColor.value === props.hexCode ? (
            <p class={props.color === 'var(--unisynth-light-blue)' ? 'text-black' : 'text-white'}>
              Copied ✓
            </p>
          ) : (
            <p class={props.color === 'var(--unisynth-light-blue)' ? 'text-black' : ''}>
              {props.name} {props.hexCode}
            </p>
          )}
        </button>
      );
    }
  );

  const unisynthColors = [
    { color: 'var(--unisynth-blue)', name: 'Unisynth Blue', hexCode: color.unisynthBlue },
    { color: 'var(--unisynth-dark-blue)', name: 'Unisynth Dark Blue', hexCode: color.unisynthDarkBlue },
    { color: 'var(--unisynth-light-blue)', name: 'Unisynth Light Blue', hexCode: color.unisynthLightBlue },
    { color: 'var(--unisynth-purple)', name: 'Unisynth Purple', hexCode: color.unisynthPurple },
    { color: 'var(--unisynth-dark-purple)', name: 'Unisynth Dark Purple', hexCode: color.unisynthDarkPurple },
    {
      color: 'var(--unisynth-dark-purple-bg)',
      name: 'Unisynth Dark Purple Bg',
      text: 'var(--unisynth-light-blue)',
      hexCode: color.unisynthDarkPurpleBg,
    },
  ];

  return (
    <main>
      <Header />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-2 px-10 py-10 md:px-32">
        {logos.map((item) => (
          <Logo key={item.title} title={item.title} alt={item.alt} downloadHref={item.downloadHref}>
            {item.Logo === 'img' ? (
              <img q:slot="logo" src={item.src} alt={item.alt} class="bg-cover" />
            ) : (
              <item.Logo q:slot="logo" alt={item.alt} class={item.className} />
            )}
          </Logo>
        ))}
        <div class="flex flex-col justify-between h-72 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div class="flex-grow grid grid-rows-6 text-center overflow-hidden px-2 py-2">
            {unisynthColors.map((colorItem) => (
              <ColorButton
                key={colorItem.name}
                color={colorItem.color}
                name={colorItem.name}
                text={colorItem.text}
                hexCode={colorItem.hexCode}
              />
            ))}
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-1">
        <a
          onClick$={downloadAllAssets}
          class="flex justify-between items-center py-2 px-4 font-medium text-center border-2 border-solid cursor-pointer select-none border-sky-500 text-sky-500 rounded-md hover:bg-sky-500 hover:text-white transition-colors duration-300"
          download
        >
          Download All Logos
        </a>
      </div>
      <Footer />
    </main>
  );
});
