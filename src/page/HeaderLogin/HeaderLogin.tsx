import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import logoTruong from '../../img/Logotruong.png';

const HeaderLogin = () => {
  return (
    <>
      <div className='bg-blue-300 h-16 flex justify-around items-center fixed w-full'>
        <div className=' w-48'>
          <img src={logoTruong} alt='' />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default HeaderLogin;
