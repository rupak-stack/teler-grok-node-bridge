import { config } from "./config";

const instructions = 'Greet the user warmly in one short sentence. Keep your voice stable. Speak english.';

export const sessionUpdateConfig = {
    "type": "session.update",
        "session": {
        "voice": "Eve",
        "instructions": instructions,
        "turn_detection": {
            "type": "server_vad"
        },
        "audio": {
            "input": {
                "format": {
                    "type": "audio/pcm",
                    "rate": 8000
                }
            },
            "output": {
                "format": {
                    "type": "audio/pcm",
                    "rate": 8000
                }
            }
        }
    }
};
