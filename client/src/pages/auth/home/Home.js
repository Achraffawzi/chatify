import React from 'react';

import "./Home.scss";

import Profil from "../../../components/images/profil.png";

const Home = () => {
  return (
    <div>
      <section className='home_profil'>

      
      <article className='home_image'>
        <img src={Profil} alt="profil" />
      </article>
      

      <article className='home_pseudo_a'>
        <p className='home_pseudo'>John Doe <br></br>
       <a href='#' className='home_a_profil'>Profile</a> </p>
      </article>
        </section>
      
    </div>
  )
}

export default Home
