import { randomUUID } from 'node:crypto';
import axios from 'axios';
import { buildMemoryStorage, setupCache } from 'axios-cache-interceptor';
import axiosRetry from 'axios-retry';
import express, { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-named-as-default
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import { ConfigureController, ExtractController, ManifestController, StreamController } from './controller';
import { createExtractors, ExtractorRegistry } from './extractor';
import { createSources, Source } from './source';
import { clearCache, envGet, envIsProd, Fetcher, StreamResolver } from './utils';

if (envIsProd()) {
  console.log = console.warn = console.error = console.info = console.debug = () => { /* disable in favor of logger */ };
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, id }) => `${timestamp} ${level} ${id}: ${message}`)),
    }),
  ],
});

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught exception caught: ${error}, cause: ${error.cause}, stack: ${error.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  logger.error(`Unhandled rejection: ${error}, cause: ${error.cause}, stack: ${error.stack}`);
});

const cachedAxios = setupCache(axios, {
  interpretHeader: true,
  storage: buildMemoryStorage(false, 3 * 60 * 60 * 1000, 4096, 12 * 60 * 60 * 1000),
  ttl: 15 * 60 * 1000, // 15m
});
axiosRetry(cachedAxios, { retries: 3, retryDelay: () => 333 });

const fetcher = new Fetcher(cachedAxios, logger);

const sources = createSources(fetcher);
const extractors = createExtractors(fetcher);

const addon = express();
addon.set('trust proxy', true);

if (envIsProd()) {
  addon.use(rateLimit({ windowMs: 60 * 1000, limit: 30 }));
}

if (envGet('CACHE_FILES_DELETE_ON_START')) {
  (async function () {
    await clearCache(logger);
  })();
}

addon.use((req: Request, res: Response, next: NextFunction) => {
  process.env['HOST'] = req.host;
  process.env['PROTOCOL'] = req.protocol;

  res.setHeader('X-Request-ID', randomUUID());

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (envIsProd()) {
    res.setHeader('Cache-Control', 'public, max-age=10, immutable');
  }

  next();
});

const extractorRegistry = new ExtractorRegistry(logger, extractors);

addon.use('/', (new ExtractController(logger, fetcher, extractorRegistry)).router);
addon.use('/', (new ConfigureController(sources, extractors)).router);
addon.use('/', (new ManifestController(sources, extractors)).router);

const streamResolver = new StreamResolver(logger, extractorRegistry);
addon.use('/', (new StreamController(logger, sources, streamResolver)).router);

// error handler needs to stay at the end of the stack
addon.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
  logger.error(`Error: ${err}, cause: ${err.cause}, stack: ${err.stack}`);

  return next(err);
});

addon.get('/', (_req: Request, res: Response) => {
  res.redirect('/configure');
});

addon.get('/startup', async (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

addon.get('/ready', async (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

addon.get('/live', async (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

addon.get('/stats', async (_req: Request, res: Response) => {
  res.json({
    extractorRegistry: extractorRegistry.stats(),
    fetcher: fetcher.stats(),
    sources: Source.stats(),
  });
});

const port = parseInt(envGet('PORT') || '51546');
addon.listen(port, () => {
  logger.info(`Add-on Repository URL: http://127.0.0.1:${port}/manifest.json`);
});
