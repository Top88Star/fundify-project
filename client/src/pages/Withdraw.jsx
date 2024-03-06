import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers, utils } from 'ethers';

import { money } from '../assets';
import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const { createCampaign } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        title: '',
        description: '',
        target: '',
        deadline: '',
        image: '',
    });

    const { connect, address } = useStateContext();

    const [donators, setDonators] = useState([]);

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setIsLoading(true);
                await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
                setIsLoading(false);
                navigate('/withdraw');
            } else {
                alert('Invalid amount');
                navigate('/withdraw');
                setIsLoading(false);
            }
        });
    };

    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && <Loader />}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Withdraw</h1>
            </div>

            {address ?
                <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                    <div className="flex flex-wrap gap-[40px]">
                        <FormField
                            labelName="Withdraw Amount *"
                            placeholder="Withdraw"
                            inputType="text"
                            value={form.name}
                            handleChange={(e) => { handleFormFieldChange('name', e) }}
                        />

                        <div>
                            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Your balance</h4>
                            <div className="mt-[20px]">
                                <p className="mt-[4px] font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                    {donators.length > 0 ? donators.map((item, index) => (
                                        <div key={`${item.donator}-${index}`} className="flex flex-row items-center gap-4">
                                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                                <img src={thirdweb} alt="creator" className="w-[60%] h-[60%] object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-epilogue font-normal text-[20px] text-white text-semibold leading-[26px] text-justify">{item.donation} SepoliaETH</p>
                                            </div>
                                        </div>
                                    )) : <p className="font-epilogue font-normal text-[20px] text-white text-semibold leading-[26px] text-justify">0.00 SepoliaETH</p>
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px] object-contain">
                            <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
                            <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mt-[40px]">
                        <CustomButton
                            btnType="submit"
                            title="Withdraw"
                            styles="bg-[#8c6dfd] mb-[10px] hover:bg-[#7a5fd3] text-white font-epilogue font-bold text-[18px] leading-[22px] py-[15px] px-[25px] rounded-[10px] cursor-pointer transition-all duration-200 ease-in-out"
                        />
                    </div>
                </form>

                : <p className="mt-5 text-white">Log in to your account</p>
            }

        </div>
    )
}

export default CreateCampaign