import * as esbuild from 'esbuild'

const ctx = await esbuild.context({
entryPoints: ['src/app.mjs'],
bundle: true,
minify: false,
sourcemap: false,
target: ['es2020'],
format: 'iife',
  banner: {
    js: `
       function require(m) {
         const MODS = {
          "@microsoft/msfs-sdk": window.msfssdk,
          "@microsoft/msfs-wt21-fmc": window.wt21_fmc,
          "@microsoft/msfs-wt21-shared": window.wt21_shared
         }
        if(MODS[m])
          return MODS[m];
         throw new Error(\`Unknown module \${m}\`);
       }
    `,
  },

jsx: 'transform',
jsxFactory: 'FSComponent.buildComponent', // MSFS SDK JSX factory
jsxFragment: 'FSComponent.Fragment',
  outfile: './ffx-hawker800xp-acars/PackageSources/Copys/ffx-hawker800xp-acars/files/liz3-ffx-hawker800xp-acars/hawker800xp-acars.js',
  external: ["@microsoft/msfs-sdk", "@microsoft/msfs-wt21-fmc", "@microsoft/msfs-wt21-shared"]
})
await ctx.watch();