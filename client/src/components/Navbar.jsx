import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';
import { useStateContext } from '../context';
import { MetaMaskAvatar } from 'react-metamask-avatar';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(location.pathname);

  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  const [toggleDrawer, setToggleDrawer] = useState(false);

  const { connect, address } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input type="text" placeholder="Search Campaign" className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" />
        <div className="w-[72px] h-full rounded-[20px] bg-[#41cd8d] flex items-center justify-center cursor-pointer">
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
        </div>
      </div>
      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if (address) navigate('create-campaign')
            else connect();
          }}
        />
        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <MetaMaskAvatar address={address} size={38} className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>
      </div>
      {/* Small screen navbar */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
        </div>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondaty py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'}  transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link, index) => (

              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.link && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.link);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] ${isActive === link.link ? 'grayscale-0' : 'grayscale'}`}
                />
                <span className={`ml-4 text-white font-epilogue font-normal text-[14px] ${isActive === link.link ? 'text-[#1dc071]' : 'text-[#808191]'}`}>{link.name}</span>
              </li>
            ))}
          </ul>
          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? 'Create a campaign' : 'Connect'}
              styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={() => {
                if (address) navigate('create-campaign')
                else connect();
              }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar