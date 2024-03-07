import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers, BigNumber } from 'ethers';
import { contractAbi } from "../constants";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract, isLoading, error } = useContract("0x3EC65A98F0A5Fe335F1794e6C2232511bCe76E71", contractAbi);
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {

        try {
            const data = await createCampaign({
                args: [
                    address, // owner
                    form.title, // title
                    form.description, // description
                    form.target,
                    new Date(form.deadline).getTime(), // deadline,
                    form.image,
                ],
            });
        } catch (error) {
            console.log('faield', error);
        }

    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaings = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            targetAmount: ethers.utils.formatEther(campaign.targetAmount.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i
        }));

        return parsedCampaings;
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter(campaign => campaign.owner === address);
        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});
    
        return data;
      }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];
        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });
        }
        return parsedDonations;
    }

    return (
        <StateContext.Provider value={{
            address,
            contract,
            connect,
            createCampaign: publishCampaign,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations
        }}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
