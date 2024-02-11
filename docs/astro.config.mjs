import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'Sagetest',
    logo: {
      src: './src/assets/logo-text-big.png',
      replacesTitle: true
    },
    customCss: [
      './src/tailwind.css'
    ],
    social: {
      github: 'https://github.com/eddienubes/sagetest'
    },
    sidebar: [
      {
        label: 'Getting Started',
        items: [
          {
            label: 'Introduction',
            link: '/getting-started/installation'
          }
        ]
      },
      // Add the generated sidebar group to the sidebar.
      typeDocSidebarGroup
    ],
    components: {
      Hero: './src/components/Hero.astro'
    },
    plugins: [
      // Generate the documentation.
      starlightTypeDoc({
        entryPoints: ['../src/index.ts'],
        tsconfig: '../tsconfig.json',
      }),
    ]
  }), tailwind({
    applyBaseStyles: false
  })]
});