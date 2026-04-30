import { Extractor } from '../extractor';
import { Source } from '../source';
import { Config, CustomManifest } from '../types';
import { envGetAppId, envGetAppName } from './env';

export const buildManifest = (sources: Source[], extractors: Extractor[], _config: Config): CustomManifest => {
  const manifest: CustomManifest = {
    id: envGetAppId(),
    version: '0.69.1', // x-release-please-version
    name: envGetAppName(),
    description: 'Provides HTTP URLs from streaming websites.',
    resources: [
      'stream',
    ],
    types: [
      'movie',
      'series',
    ],
    catalogs: [],
    idPrefixes: ['tmdb:', 'tt'],
    logo: 'https://emojiapi.dev/api/v1/spider_web/256.png',
    behaviorHints: {
      p2p: false,
      configurable: false,
      configurationRequired: false,
    },
    config: [],
    stremioAddonsConfig: {
      issuer: 'https://stremio-addons.net',
      signature: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..D3-Wl15vxnYltwx8G52rRg.16-0VzsSgTvnv0wampIR8YPZsFhH8-7IgpuqxcUfC2p7kIJtuk8xQzrzqQOLXANEpaH_w7a4JOEpNo8wv28Zo_nMGCLOXgWbyGM3sQ-tfq6DCK3JU0ol6YMC1UDX2z_c.IOLlZyTYx_swutjYSTES0Q',
    },
  };

  sources.sort((sourceA, sourceB) => sourceA.label.localeCompare(sourceB.label));

  manifest.description += `\n\nSupported sources: ${sources.map(source => source.label).join(', ')}`;
  manifest.description += `\n\nSupported extractors: ${extractors.map(extractor => extractor.label).join(', ')}`;

  return manifest;
};
