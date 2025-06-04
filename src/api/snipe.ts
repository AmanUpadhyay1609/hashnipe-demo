import { ethers } from "ethers";

export const SnipeContract = "0x70Bbf55CC7D401Bb780e07FE4b7fF8F18Db91BfA";
export const VIRTUALS_TOKEN_ADDRESS = "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b";
export const WRAPPED_ETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

interface AgentRequest {
    genesisId: string;
    name: string;
    walletAddress: string;
    token: "eth" | "virtual";
    amount: string;
    launchTime: Date;
    marketCap: string;
}
interface AgentResponse {
    success: boolean;
    message: string;
    data?: any;
}
interface DepositParams {
    tokenAddress: string;
    amount: string;
    provider: any;
}
interface AgentStatusResponse {
    success: boolean;
    message: string;
    data?: {
        status: string;
        genesisId: string;
        walletAddress: string;
        createdAt: string;
        updatedAt: string;
    };
}

const snipeAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// Add ERC20 ABI at the top of the file
const erc20Abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

class AgentService {
    private static instance: AgentService;
    private loading: boolean = false;
    private contract: string = SnipeContract;
    private abi: any = snipeAbi;
    private readonly BASE_URL =
        "https://web3.okx.com/priapi/v1/dx/trade/multi/outer/v3/quote/snap-mode";
    private readonly DEFAULT_SLIPPAGE = 0.1;
    private readonly DEFAULT_SLIPPAGE_TYPE = 1;
    private readonly DEFAULT_PMM = 1;
    private readonly DEFAULT_GAS_DROP_TYPE = 0;
    private readonly DEFAULT_FORBIDDEN_BRIDGE_TYPES = 0;
    private constructor() { }
    public static getInstance(): AgentService {
        if (!AgentService.instance) {
            AgentService.instance = new AgentService();
        }
        return AgentService.instance;
    }
    public isLoading(): boolean {
        return this.loading;
    }


    public async deposit(
        params: DepositParams
    ): Promise<any> {
        try {
            this.loading = true;
            const { tokenAddress, amount, provider } = params;
            const signer = provider;

            // Convert amount to wei (18 decimals)
            const amountInWei = ethers.parseUnits(amount, 18);
            console.log("amountInWei", amountInWei, tokenAddress)
            console.log("provider", signer)

            // Check if it's ETH deposit
            const isEth = tokenAddress !== VIRTUALS_TOKEN_ADDRESS;

            if (!isEth) {
                // For VIRTUAL token deposits, approve first
                const tokenContract = new ethers.Contract(
                    VIRTUALS_TOKEN_ADDRESS,
                    erc20Abi,
                    signer
                );

                console.log('Approving VIRTUAL tokens...', tokenContract);
                const approveTx = await tokenContract.approve(
                    this.contract, // SnipeContract address
                    amountInWei
                );
                console.log('Waiting for approval confirmation...');
                await approveTx.wait();
                console.log('Approval confirmed');
            }

            // Create contract instance with signer for deposit
            const contract = new ethers.Contract(
                this.contract,
                this.abi,
                signer
            );

            console.log('Initiating deposit...');
            let tx;
            if (isEth) {
                tx = await contract.deposit(tokenAddress, amountInWei, {
                    value: amountInWei
                });
            } else {
                tx = await contract.deposit(tokenAddress, amountInWei);
            }

            console.log('Waiting for deposit confirmation...');
            const receipt = await tx.wait();
            console.log('Deposit confirmed');
            return receipt;
        } catch (error) {
            console.error("Error in deposit:", error);
            throw error;
        } finally {
            this.loading = false;
        }
    }
    public async createAgent(data: any): Promise<AgentResponse> {
        try {
            this.loading = true;
            const response = await fetch(
                "https://dexter-backend-ucdt5.ondigitalocean.app/api/agent/subscribe",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to create agent");
            }
            const result = await response.json();
            return result;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "An error occurred while creating agent";
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            this.loading = false;
        }
    }
    public async checkAgentStatus(
        genesisId: string,
        walletAddress: string
    ): Promise<AgentStatusResponse> {
        try {
            this.loading = true;
            const response = await fetch(
                `https://dexter-backend-ucdt5.ondigitalocean.app/api/agent/${genesisId}/status/${walletAddress}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to check agent status");
            }
            const result = await response.json();
            return result;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "An error occurred while checking agent status";
            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            this.loading = false;
        }
    }
    private buildQueryString(params: any): string {
        const queryParams = new URLSearchParams({
            chainId: params.chainId.toString(),
            toChainId: params.toChainId.toString(),
            fromTokenAddress: params.fromTokenAddress,
            toTokenAddress: params.toTokenAddress,
            amount: params.amount,
            userWalletAddress: params.userWalletAddress,
            slippage: (params.slippage || this.DEFAULT_SLIPPAGE).toString(),
            slippageType: (
                params.slippageType || this.DEFAULT_SLIPPAGE_TYPE
            ).toString(),
            pmm: (params.pmm || this.DEFAULT_PMM).toString(),
            gasDropType: (
                params.gasDropType || this.DEFAULT_GAS_DROP_TYPE
            ).toString(),
            forbiddenBridgeTypes: (
                params.forbiddenBridgeTypes || this.DEFAULT_FORBIDDEN_BRIDGE_TYPES
            ).toString(),
            dexIds: params.dexIds,
            t: (params.timestamp || Date.now()).toString(),
        });
        return queryParams.toString();
    }
    async getQuote(params: any): Promise<any> {
        try {
            const queryString = this.buildQueryString(params);
            const response = await fetch(`${this.BASE_URL}?${queryString}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: any = await response.json();
            if (data.code !== 0) {
                throw new Error(`API error: ${data.message}`);
            }
            return data.data?.singleChainSwapInfo?.youSaveDTO?.topTenDexInfoList[0]
                .amountOut;
        } catch (error) {
            console.error("Error fetching quote:", error);
            throw error;
        }
    }
    // Helper method to validate token addresses
    validateTokenAddresses(fromToken: string, toToken: string): boolean {
        return (
            /^0x[a-fA-F0-9]{40}$/.test(fromToken) &&
            /^0x[a-fA-F0-9]{40}$/.test(toToken)
        );
    }
    // Helper method to format amount based on token decimals
    formatAmount(amount: string, decimals: number): string {
        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                throw new Error("Invalid amount");
            }
            return parsedAmount.toFixed(decimals);
        } catch (error) {
            console.error("Error formatting amount:", error);
            throw error;
        }
    }
}
export const agentService = AgentService.getInstance();