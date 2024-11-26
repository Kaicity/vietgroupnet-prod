import { getAllBanks } from "../api/bank";

export let bankOption = [];

export const getAllBankOption = async () => {
  try {
    const page=1;
    const limit=48;
    const respone = await getAllBanks({page,limit});
    bankOption=respone.data.banks.map((bank)=>({
        value : bank.bankCode,
        label: bank.bankName
    }))
     return bankOption
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
};