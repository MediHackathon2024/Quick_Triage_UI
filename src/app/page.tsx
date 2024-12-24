'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/app/components/Navbar";
import Head from "next/head";
import lock from './lock.png';
import efficiency from './efficiency.png';
import money from './money.png';
import humanity from './humanity.png';
import whitelogo from './white logo.png';
import Image from 'next/image';
import { title } from 'process';


const GetStartedPage = () => {
    const router = useRouter()

    const handleGetStartedClick = () => {
        router.push('/quicktriage');
    };

    useEffect(() => {
        router.prefetch('/quicktriage')
    }, [router]);

    return (
        <>
            <Head>
                <title>Get Started</title>
                <meta name="description" content="Begin your journey here, dispatcher." />
            </Head>
            {/* "rgb(108, 108, 229)" */}
            <body className="overflow-scroll" style={{backgroundColor:"rgb(0, 103, 237)" }}> 
            <Navbar/>
                <div className="flex flex-col place-items-center font-inter justify-center items-center w-screen h-screen bg-gradient-radial w-screen from-[#5656b7] to-[#000000] bg-[length:200%_200%] bg-dynamic-gradient animate-gradientFlow">
                    <p className="text-center mt-[-50px] mb-2.5 text-6xl text-white">
                        Welcome to QuickTriage
                    </p>
                    <p className="text-center mb-5 text-xl text-white">
                        Press the button below to begin your journey
                    </p>
                    <button onClick={handleGetStartedClick} className="text-white py-2.5 px-5 rounded-full border-none cursor-pointer" style={{ backgroundColor: "rgb(0, 103, 237)"}}>
                        Get Started
                    </button>
                </div>
            
            <div className={"flex items-center justify-center bg-white w-screen h-[500px]"} style={{backgroundColor: 'white' }}>
            <section className="flex flex-row place-items-center justify-center items-center w-screen h-[500px]">
                <div id="privacy" className={"flex flex-col items-center text-center justify-center h-[350px] w-[350px] m-auto text-3xl border rounded-xl border-gray-400"} style={{color: "rgb(50,51,56)"}}>
                    <Image src={lock} alt="lock" className="h-[200px] w-[200px]"/>
                    Privacy
                    <p className="text-sm mt-[20px] w-[320px]">Call transcripts and AI generated information are not sent to any other application or saved to our server to ensure user privacy.</p>
                </div>
                <div id="efficiency" className={"flex flex-col items-center text-center justify-center h-[350px] w-[350px] m-auto text-3xl border rounded-xl border-gray-400"} style={{color: "rgb(50,51,56)" }}>
                    <Image src={efficiency} alt="efficiency" className="h-[170px] w-[170px] m-[7px] mb-[19px]"/>
                    Efficiency
                    <p className="text-sm mt-[20px] w-[320px]">Quickly extrapolates relevant information to be sent to emergency services and improve response times. </p>
                </div>
                <div id="cost" className={"flex flex-col items-center text-center justify-center h-[350px] w-[350px] m-auto text-3xl border rounded-xl border-gray-400"} style={{color: "rgb(50,51,56)" }}>
                <Image src={money} alt="money" className="h-[170px] w-[180px] m-[9px] mb-[9px]"/>
                    Cost
                    <p className="text-sm mt-[20px] w-[320px]">Completely FREE to give all the same access to life-saving technology, especially in lower-income areas affected by outdated equipment.
                    </p>
                </div>
                </section>
            </div>
            <div className="flex flex-col font-inter justify-center w-screen h-[1200px] bg-gradient-radial w-screen from-[#5656b7] to-[#000000] bg-[length:200%_200%] bg-dynamic-gradient animate-gradientFlow text-5xl" style={{color: "white"}}>
                <div id="our-mission" className="flex flex-col text-center mb-[20px]">
                    Our Mission
                </div>
                <div id="mission-statement" className="flex text-center text-lg mb-[180px] m-[20px]">
                    We aim to assist dispatchers by eliminating menial tasks that can cause them to lose focus in a situation where even a few seconds can be the difference between life and death. Our software decreases the time between the call and the arrival of emergency services and allows dispatchers to improve personal connection with the caller and soothe them during their emergency instead of multitasking.
                </div>
                <div  id="humanity" className="flex flex-col place-items-center justify-center items-center">
                <Image src={humanity} alt="humanity" className="h-[170px] w-[180px] m-[9px] mb-[9px]"/>
                </div>
                <div id="human-touch" className="flex flex-col text-center mb-[15px]">
                    The Human Touch
                </div>
                <div id="the-human-touch" className="flex text-center text-lg mb-[0px] m-[20px]">
                While competing softwares utilize an automated answering feature, our product maintains arguably the most important part of an emergency call – the human touch. We believe that the most critical part of a 911 call is the unique human ability to connect with the caller that every dispatcher, regardless of their experience, possesses. QuickTriage allows dispatchers to refine that ability while decreasing their stress by removing the automated parts of their job.
                </div>
            </div>
            {/* <div className="flex h-[120px] w-screen" style={{backgroundColor: "#007bff"}}> */}
            {/* <Image src="" alt="white logo" className="h-[110px] w-[180px] mt-[5px] mb-[19px]"/> */}
            {/* </div> */}
            </body>
            <style jsx>{`
        body{
        overflow-x: hidden;
        }
        #privacy {
            scale: .8; opacity: 0;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 0%;
        }
        #efficiency {
            scale: .8; opacity: 0;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 50%;
            
        }
        #cost {
            scale: .8; opacity: 0;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 80%;
        }
        #our-mission {
            scale: .8; opacity: 0;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 0% 400px;
        }
        #mission-statement {
            scale: .8; opacity: 0;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 60% 400px;
        }
        #human-touch {
            scale: .8; opacity: 0;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 0% 500px;
        }
        #humanity {
            scale: .8; opacity: 0;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 60% 450px;
        }
        #the-human-touch {
            opacity: 0;
            scale: .8;
            animation: fade-in linear forwards;
            animation-timeline: view();
            animation-range: entry 10% 400px;
        }
        
        @keyframes fade-in{
        to {scale: 1; opacity: 1;}
        }
        

      `}</style>
        </>
    );
};

export default GetStartedPage;