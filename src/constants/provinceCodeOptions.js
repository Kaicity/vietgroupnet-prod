import { getProvinces } from "../api/provinces";

export let provinceOptions = [];
export const getallProvinces = async () => {
  try {
    const page = 1;
    const limit = 63;
    const response = await getProvinces({ page, limit });
      provinceOptions=response.data.provinces.map((province)=>({
        value:province.provinceCode,
        label: province.provinceName,
      }))
      return provinceOptions;
    }
   catch (error) {
    console.error("Error fetching provinces:", error);
    throw error; 
  }
};
