import axios from "axios";

interface SecretResponse {
    value: string;
    expires_at: number;
}

export class GrokClient { 
    private baseURL: string = "https://api.x.ai/v1";
    private expiresAfter: number;
    private apiKey: string;
    private secret: string | null;

    constructor(apiKey: string, expiresAfter: number = 300) {
        this.apiKey = apiKey;
        this.expiresAfter = expiresAfter;
        this.secret = null;
    }

    public getSecret = async (): Promise<boolean> => {
        try{
            const body = {
                expires_after: { seconds: this.expiresAfter }
            };
    
            const headers = {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            };
    
            const clientResponse = await axios.post<SecretResponse>(`${this.baseURL}/realtime/client_secrets`, body, {headers});
            this.secret = clientResponse?.data?.value ?? null;
            return (this.secret) ? true : false;
        } catch(err) {
            if (axios.isAxiosError(err)) {
                console.error("XAI API Error", "Status: ", err.response?.status, "Data: ", err.response?.data?.code);
            }
            return false;
        }
    }

    public getRemoteHeaders = () => {
        const remoteHeaders: Record<string, string> = { Authorization: `Bearer ${this.secret}` };
        return remoteHeaders;
    }
}