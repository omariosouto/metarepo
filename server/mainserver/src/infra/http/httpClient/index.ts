import fs from 'fs';
import path from 'path';
import { slugify } from '../../string/slugify';
import cache from './_cache';

function HttpClientCacheManager(url) {
  const normalizedUrl = slugify(url);
  const cacheDirPath = path.resolve('src', 'infra', 'http', 'httpClient', '_cache');
  const cacheFilePath = path.resolve(cacheDirPath, `${normalizedUrl}.ts`);
  const cacheEntryPath = path.resolve(cacheDirPath, `index.ts`);

  return {
    getCachedResult() {
      return cache[normalizedUrl];
    },
    isCached() {
      return fs.existsSync(cacheFilePath);
    },
    createCache(content) {
      fs.writeFileSync(cacheFilePath, `export default ${JSON.stringify(content)}`, { encoding: 'utf8' });
      const allCachedFiles = fs.readdirSync(cacheDirPath)
        .filter((item) => !item.includes('index.ts'))
        .map((item) => item.replace('.ts', ''));

      fs.writeFileSync(cacheEntryPath, (
        `
        ${allCachedFiles.map((item) => `import ${item} from './${item}';`).join('\n')}
        export default {
          ${allCachedFiles.map((item) => `${item},`).join('\n')}
        }
      `), { encoding: 'utf8' });
    },
  }
}

export async function httpClient(url: string, options: any = { cache: true }) {
  const httpClientCacheManager = HttpClientCacheManager(url);


  if(options.cache && httpClientCacheManager.isCached()) {
    console.log('request: cached', url);
    return httpClientCacheManager.getCachedResult();
  }

  console.log('request: direct', url);
  return fetch(url, options)
    .then(async (response) => {
      const res = await response.text();
      if (response.ok) {
        return JSON.parse(res);
      }
      throw new Error(res);
    })
    .then(response => {
      httpClientCacheManager.createCache(response);
      return response
    })
}
