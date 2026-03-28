import { StreamHandlerResult, StreamOP } from "@frejun/teler";
import { sessionUpdateConfig } from "../core/grokConfig";

let isSessionUpdated = false;

export const callStreamHandler = async (message: string): Promise<StreamHandlerResult> => {
    try {
        const data = JSON.parse(message);

        if(isSessionUpdated && data["type"] === "audio") {
            const audio: string = data?.data?.audio_b64;
            if (!audio) {
                return ['', StreamOP.PASS];
            }

            const payload = JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: audio,
            });

            return [payload, StreamOP.RELAY];

        }
        return ['', StreamOP.PASS];
    } catch(err) {
        console.info("Error in call stream handler", err);
        return ['', StreamOP.PASS];
    }
}

export const remoteStreamHandler = () => {
    let chunkId = 1;
    
    const handler = async(message: string): Promise<StreamHandlerResult> => {
        try {
            let data: Record<string, any>;
            data = JSON.parse(message.toString());
            
            const msgType = data.type ?? 'unknown';

            if (msgType === 'response.output_audio.delta') {
                const audio = data.delta ?? '';
                if (!audio) {
                    return ['', StreamOP.PASS];
                }

                const payload = JSON.stringify({
                    "type": "audio",
                    "audio_b64": audio,
                    "chunk_id": chunkId++,
                });
                return [payload, StreamOP.RELAY];
                
            } else if (msgType === 'input_audio_buffer.speech_started') {
                const payload = JSON.stringify({
                    "type": "clear"
                });
                return [payload, StreamOP.RELAY];
                
            } else if (msgType === 'session.created') {
                console.info(`Grok session created: ${data?.session?.id}`);
                const payload = JSON.stringify({
                    type: 'session.update',
                    session: sessionUpdateConfig,
                });
                return [payload, StreamOP.RELAY];
                
            } else if (msgType === 'session.updated') {
                console.info('Grok session updated');
                isSessionUpdated = true;

            } else if (msgType === 'error') {
                console.error('Grok error:', data.error ?? {});
            }

            return ['', StreamOP.PASS];
        } catch (err) {
            console.info("Error in remote stream handler", err);
            return ['', StreamOP.PASS];
        }
    }

    return handler;
}