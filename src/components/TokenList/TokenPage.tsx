import { useGenesis } from "../../context/GenesisContext";
import { TokenList } from "./TokenList";

export const TokenPage: React.FC = () => {
    const { sentients } = useGenesis();
    console.log("sentient", sentients)
    return (
        <div className="container mx-auto p-4">
           
        </div>
    );
};