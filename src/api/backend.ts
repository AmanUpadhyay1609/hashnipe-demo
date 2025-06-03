import { error } from "console";

const BaseUrl = import.meta.env.VITE_BACKEND_URL

export const getToken = async (chainId: any, jwt: any) => {
    try {
        const res = await fetch(`${BaseUrl}/api/v1/supported-tokens/${chainId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`

            }
        })
        const response = await res.json();
        return response.data;
    } catch (err) {
        throw new Error(err)
    }
}


// const handleSnipe = async () => {
//     if (!selectedVitualtoken || isLoading || isProcessing) return;
//     let approveToastId: string | number | null = null;
//     let processToastId: string | number | null = null;
//     try {
//         setIsLoading(true);
//         setIsProcessing(true);
//         processToastId = toast.info("Processing Transaction...", {
//             autoClose: false,
//             closeOnClick: false,
//             closeButton: false,
//         });
//         const isEth = selectedVitualtoken.symbol === "ETH" ? true : false;
//         if (!isEth) {
//             try {
//                 // approveToastId = toast.info("Checking token allowance...", {
//                 //   autoClose: false,
//                 //   closeOnClick: false,
//                 //   closeButton: false,
//                 // });
//                 const allowance = await approvalService.checkAllowance({
//                     tokenAddress: VIRTUALS_TOKEN_ADDRESS,
//                     provider: networkData?.provider!,
//                     spenderAddress: SnipeContract,
//                 });
//                 // If allowance is less than amount, approve first
//                 if (Number(allowance) < Number(amount)) {
//                     if (approveToastId) toast.dismiss(approveToastId);
//                     approveToastId = toast.info("Approving token spend...", {
//                         autoClose: false,
//                         closeOnClick: false,
//                         closeButton: false,
//                     });
//                     await approvalService.approveVirtualToken(
//                         amount.toString(),
//                         networkData?.provider!,
//                         VIRTUALS_TOKEN_ADDRESS,
//                         SnipeContract
//                     );
//                     if (approveToastId) toast.dismiss(approveToastId);
//                     toast.success("Token approved successfully!");
//                 } else {
//                     if (approveToastId) toast.dismiss(approveToastId);
//                 }
//             } catch (error: any) {
//                 if (approveToastId) toast.dismiss(approveToastId);
//                 toast.error(
//                     "Failed to approve token: " + (error.message || "Unknown error")
//                 );
//                 throw error;
//             }
//         }
//         const receipt = await agentService.deposit({
//             tokenAddress: isEth ? WRAPPED_ETH_ADDRESS : VIRTUALS_TOKEN_ADDRESS,
//             amount: amount,
//             provider: networkData?.provider!,
//         });
//         if (receipt.transactionHash) {
//             const response = await agentService.createAgent({
//                 genesisId,
//                 name,
//                 walletAddress,
//                 token: selectedVitualtoken.symbol === "ETH" ? "eth" : "virtual",
//                 amount: (
//                     (Number(amount) - 0.003 * Number(amount)) *
//                     10 ** 18
//                 ).toString(),
//                 launchTime: new Date(endsAt),
//                 marketCap: marketCapBuyRange.toString(),
//             });
//             triggerAPIs();
//             fetchSubscriptionData();
//             if (!response.success) {
//                 throw new Error(response.message);
//             }
//             if (processToastId) toast.dismiss(processToastId);
//             toast.success("Snipe successful! :tada:");
//             onClose();
//         } else {
//             if (processToastId) toast.dismiss(processToastId);
//             toast.error("Snipe Failed!");
//         }
//     } catch (error: any) {
//         if (approveToastId) toast.dismiss(approveToastId);
//         if (processToastId) toast.dismiss(processToastId);
//         console.error("Error in snipe:", error);
//         console.error("Error in quick buy:", error);
//         // Handle specific error cases
//         if (error.code === "INSUFFICIENT_FUNDS") {
//             toast.error("Insufficient funds to complete the transaction");
//         } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
//             toast.error(
//                 "Transaction would fail. Please check your input amounts and try again"
//             );
//         } else if (error.message?.includes("user rejected")) {
//             toast.error("Transaction was rejected by user");
//         } else if (error.message?.includes("insufficient funds")) {
//             toast.error("Insufficient balance to complete the transaction");
//         } else if (error.message?.includes("execution reverted")) {
//             toast.error("Transaction failed: Contract execution reverted");
//         } else {
//             // For other errors, show a more user-friendly message
//             const errorMessage = error.message || "Unknown error occurred";
//             toast.error(`Transaction failed`);
//         }
//     } finally {
//         setIsLoading(false);
//         setIsProcessing(false);
//     }
// };
