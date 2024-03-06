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

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  }

  const { connect, address } = useStateContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Invalid Image URL');
        setForm({ ...form, image: '' });
      }

    });
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      {address ?
        <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
          <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Your Name *"
              placeholder="Enter your name"
              inputType="text"
              value={form.name}
              handleChange={(e) => { handleFormFieldChange('name', e) }}
            />
            <FormField
              labelName="Campaign Title *"
              placeholder="Write a title for your campaign *"
              inputType="text"
              value={form.title}
              handleChange={(e) => { handleFormFieldChange('title', e) }}
            />
            <FormField
              labelName="The idea behind your campaign *"
              placeholder="Write your story *"
              isTextArea={true}
              value={form.description}
              handleChange={(e) => { handleFormFieldChange('description', e) }}
            />

            <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px] object-contain">
              <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
              <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
            </div>

            <FormField
              labelName="Goal *"
              placeholder="ETH 0.50"
              inputType="text"
              value={form.target}
              handleChange={(e) => { handleFormFieldChange('target', e) }}
            />
            <FormField
              labelName="End Date *"
              placeholder="End Date"
              inputType="date"
              value={form.deadline}
              handleChange={(e) => { handleFormFieldChange('deadline', e) }}
            />
          </div>
          <FormField
            labelName="Campaign Image *"
            placeholder="Place the image URL"
            inputType="url"
            value={form.image}
            handleChange={(e) => { handleFormFieldChange('image', e) }}
          />

          <div className="flex items-center justify-center mt-[40px]">
            <CustomButton
              btnType="submit"
              title="Create Campaign"
              styles="bg-[#8c6dfd] mb-[10px] hover:bg-[#7a5fd3] text-white font-epilogue font-bold text-[18px] leading-[22px] py-[15px] px-[25px] rounded-[10px] cursor-pointer transition-all duration-200 ease-in-out"
            />
          </div>
        </form>

        : <p className="mt-5 text-white">To start a campaign please connect your wallet</p>
      }

    </div>
  )
}

export default CreateCampaign