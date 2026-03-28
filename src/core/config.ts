import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port:                   Number(process.env.PORT) || 8000,
    nodeEnv:                process.env.NODE_ENV || 'development',
    serverDomain:           process.env.SERVER_DOMAIN || '',

    telerKey:               process.env.TELER_API_KEY || '',
    telerSameplRate:        process.env.TELER_SAMPLE_RATE || '8k',
    telerChunkSize:         process.env.TELER_CHUNK_SIZE || 500,
    
    XAIWsUrl:              process.env.GROK_WS_URL || '',
    XAISampleRate:         process.env.GROK_SAMPLE_RATE || 8000,
    XAIApiKey:             process.env.GROK_API_KEY || '',
} as const;