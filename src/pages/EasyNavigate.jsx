import React from 'react'
import { VscCommentDiscussionSparkle, VscInspect } from "react-icons/vsc";
import './EasyNavigate.css'
import { FaMapMarkedAlt } from 'react-icons/fa';
import { SiSocialblade } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

export const EasyNavigate = () => {
    const navigate = useNavigate();

    const navigateToMapSection = () => {
        navigate('/#map-section');
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    const openChatLink = () => {
        window.open('https://wa.me/c/573233416763', '_blank');
    };

    const openSocialMedia = (url) => {
        window.open('https://www.instagram.com/casasanue/', '_blank');
    };

    return (
        <div className='EN_body'>
            <section className="selection" >
                <h1 className="tysTittle">Navega fácilmente por nuestra web</h1>
                <div className="top">
                    <div className="icon34" onClick={navigateToRegister}>
                        <VscInspect className='iconvs' />
                        <h1 className="tys">Regístrate en nuestra web</h1>
                    </div>
                    <div className="icon34" onClick={() => openSocialMedia('https://www.instagram.com/casasanue/')}>
                        <SiSocialblade className='iconvs' />
                        <h1 className="tys">Redes Sociales</h1>
                    </div>
                </div>
                <div className="bottom">
                    <div className="icon34" onClick={navigateToMapSection}>
                        <FaMapMarkedAlt className='iconvs' />
                        <h1 className="tys">Ubicación</h1>
                    </div>
                    <div className="icon34" onClick={openChatLink}>
                        <VscCommentDiscussionSparkle className='iconvs' />
                        <h1 className="tys">Chat</h1>
                    </div>
                </div>
            </section>
        </div>
    )
}

