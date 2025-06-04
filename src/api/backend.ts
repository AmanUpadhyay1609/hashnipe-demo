interface BalanceResponse {
    balance: string;
    symbol: string;
    decimals: number;
}

const BaseUrl = 'https://api.virtuals.io/api';

export const getVirtualBalance = async (
    tokenAddress: string,
    walletAddress: string
): Promise<BalanceResponse> => {
    try {
        const response = await fetch(
            `${BaseUrl}/dex/balance-of/${tokenAddress}/${walletAddress}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching virtual balance:', error);
        throw error;
    }
};
