'use client';

import React, { useEffect, useState, useRef, RefObject } from 'react';
import Navbar from '../components/Navbar';
import Head from "next/head";
import {title} from "process";
import { stringify } from 'querystring';
<meta name="viewport" content="width=device=width, initial-scale=1"></meta>

const Page = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [responseToggle, setResponseToggle] = useState(true);
  const [medicalRecommendationToggle, setMedicalRecommendationToggle] = useState(false); // New state for medical recommendations
  let [apiCounter, setApiCounter] = useState(0);
  let [transcript, setTranscript] = useState('');
  let [response, setResponse] = useState('');
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const clearStorageButtonRef = useRef<HTMLButtonElement>(null);
  const toggleResponseButtonRef = useRef<HTMLButtonElement>(null);
  const exportTranscriptButtonRef = useRef<HTMLButtonElement>(null);
  const circle1Ref = useRef(null);
  const circle2Ref = useRef(null);
  const transcriptRef = useRef(null);
  const responseRef = useRef(null);
  const hiddenTranscriptionRef = useRef(null);
  let socket: WebSocket | null = null;


  const navbarHeight = '56px';

  useEffect(() => {
    // Load stored transcript on page load
    const storedTranscript = localStorage.getItem('transcript');
    if (storedTranscript) {
      setTranscript(storedTranscript);
    }
  }, []);

  useEffect(() => {
    // Save transcript to localStorage whenever it changes
    localStorage.setItem('transcript', transcript);
  }, [transcript]);

  useEffect(() => {
    // Load stored response on page load
    const storedResponse = localStorage.getItem('response');
    if (storedResponse) {
      setResponse(storedResponse);
    }
  }, []);

  useEffect(() => {
    // Save transcript to localStorage whenever it changes
    localStorage.setItem('response', response);
  }, [response]); // Triggered whenever transcript state changes */

  useEffect(() => {
    if (startButtonRef.current) {
      startButtonRef.current.textContent = isRecording ? 'Stop Voice Input' : 'Start Voice Input';
    }

    if (isRecording) {
      manageWebSocketConnection(true);
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        manageWebSocketConnection(false);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (responseToggle) {
      if (toggleResponseButtonRef.current) {
        toggleResponseButtonRef.current.textContent = 'Disable Response';
      }
    } else {
      if (toggleResponseButtonRef.current) {
        toggleResponseButtonRef.current.textContent = 'Enable Response';
      }
    }
  }, [responseToggle]);

  // New effect to manage medical recommendation toggle button text
  useEffect(() => {
    if (medicalRecommendationToggle) {
      // Handle the text of the medical recommendation toggle button
      if (toggleResponseButtonRef.current) {
        toggleResponseButtonRef.current.textContent = 'Disable Medical Recommendations';
      }
    } else {
      if (toggleResponseButtonRef.current) {
        toggleResponseButtonRef.current.textContent = 'Enable Medical Recommendations';
      }
    }
  }, [medicalRecommendationToggle]);

  const formatResponse = (responseText: string) => {
    // Define patterns to insert line breaks before
    const patterns = ["Name:", "Address:", "Reason for the call:", "Emergency status:", "Emergency department requested:", "Address/Location:"];

    // Replace patterns with themselves preceded by <br>, except for the first one
    let formattedResponse = responseText;
    patterns.forEach((pattern, index) => {
        if (index > 0) { // Skip the first pattern to avoid a leading <br>
            formattedResponse = formattedResponse.replace(pattern, `\n${pattern}`);
        }
    });

    return formattedResponse;
  };

  let mediaRecorder: MediaRecorder;

  const manageWebSocketConnection = (shouldConnect: boolean) => {
    if (shouldConnect) {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          console.log({ stream });
          if (!MediaRecorder.isTypeSupported('audio/webm') || typeof MediaRecorder === "undefined" || !navigator.mediaDevices.getUserMedia)
            return alert('Browser not supported');
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm',
          });
          socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=nova-2-general&language=en-US', [
            'token',
            '69bdc868a74205816a0617e7024be1fcb8ce3e95',
          ]);
          socket.onopen = () => {
            const connectionElement = document.querySelector('#connection');
            if (connectionElement) connectionElement.textContent = 'Connected';
            const circle2 = document.querySelector('#circle2');
            if (circle2) (circle2 as HTMLElement).style.backgroundColor = '#18E93E';
            console.log({ event: 'onopen' });
            mediaRecorder.addEventListener('dataavailable', async (event) => {
              if (event.data.size > 0 && socket && socket.readyState === WebSocket.OPEN) {
                socket.send(event.data);
              }
            });
            mediaRecorder.start(100);
          };


          socket.onmessage = (message) => {
            try {
              const received = JSON.parse(message.data);
              if (received.channel && received.channel.alternatives && received.channel.alternatives.length > 0) {
                const newTranscript = received.channel.alternatives[0].transcript;
                if (newTranscript && received.is_final) {
                  console.log(newTranscript);

                  const now = new Date();
                  const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

                  setTranscript(prevTranscript => `${prevTranscript}${timestamp}> ${newTranscript}\n`);
                  
                  const existingTranscriptElement = document.querySelector('#transcript');
                  if (existingTranscriptElement) {
                    //existingTranscriptElement.innerHTML += timestamp + '> ' + newTranscript + '<br>';
                  }
                  const hiddenTranscriptionElement = document.querySelector('#hiddenTranscription');
                  if (hiddenTranscriptionElement && existingTranscriptElement) {
                    hiddenTranscriptionElement.textContent = transcript ?? '';
                  }
                
                  const encodedTranscript = encodeURIComponent(existingTranscriptElement?.textContent + "\n" + newTranscript);
                  const url = `https://api.letssign.xyz/chat?prompt=${encodedTranscript}`;

                  if (responseToggle) {
                    const fetchAPI = (url: string) => {
                      fetch(url)
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('Network response was not ok');
                          }
                          return response.text();
                        })
                        .then(data => {
                          console.log(data);
                          setResponse(data);
                          //console.log(formatResponse(data));
                          //localStorage.setItem('response', response);
                          //const responseElement = document.querySelector('#response');
                          //if (responseElement) {
                            //responseElement.innerHTML = formatResponse(data);
                          //}

                          apiCounter++;
                        })
                        .catch(error => {
                          console.error('There was a problem with your fetch operation:', error);
                        });
                    }

                    const fetchWithRateLimit = (url: string) => {
                      if (apiCounter >= 10) {
                        console.log('API rate limit reached. Setting cooldown to 2 seconds.');
                        setTimeout(() => {
                          fetchAPI(url);
                        }, 2000);
                      } else {
                        fetchAPI(url);
                      }
                    }

                    fetchWithRateLimit(url);
                  }
                }
              } else {
                console.log('Received message does not contain expected data.');
              }
            } catch (error) {
              console.error('Error processing message:', error);
            }
          };
          socket.onclose = () => {
            mediaRecorder.stop();
            console.log('WebSocket Disconnected');
            const connectionElement = document.querySelector('#connection');
            if (connectionElement) {
              connectionElement.textContent = 'Not Connected';
            }
          };
          socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
          };
        }).catch(error => {
          console.error('Error getting user media:', error);
        });
      } else {
        console.error('WebSocket is already connected.');
      }
    } else {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        socket = null;
        /*
        if (circle2) {
          circle2.style.backgroundColor = '#ff0000';
        }
        */
        console.log('WebSocket Disconnected');
        mediaRecorder.stop();
        console.log('MediaRecorder Stopped');
      }
    }
  };

  const handleStartButtonClick = () => {
    try {
      setIsRecording(!isRecording);
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleClearStorageButtonClick = () => {
    localStorage.removeItem('transcript');
    localStorage.removeItem('response');
    setTranscript('');
    setResponse('');
  };

  const handleToggleResponseButtonClick = () => {
    setResponseToggle(!responseToggle);
    console.log(responseToggle);
    // Update button text and styles...
  };

  const handleToggleMedicalRecommendationButtonClick = () => {
    setMedicalRecommendationToggle(!medicalRecommendationToggle);
    console.log(medicalRecommendationToggle);
    // Add logic to enable/disable medical recommendations...
  };

  const handleExportTranscriptButtonClick = () => {
    const combinedContent = `Transcript:\n${transcript.toString()}\n\nResponse:\n${response.toString()}`;

    const blob = new Blob([combinedContent], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    if (response.includes("Fire") && response.includes("Police") && response.includes("EMS")){
      a.download = 'transcript_and_response_fire+police+EMS.txt';
    }
      else if (response.includes("Police") && response.includes("EMS")){
      a.download = 'transcript_and_response_police+EMS.txt';
    }
      else if (response.includes("Fire") && response.includes("Police")){
      a.download = 'transcript_and_response_police+fire.txt';
    }
      else if (response.includes("Fire") && response.includes("EMS")){
      a.download = 'transcript_and_response_EMS+fire.txt';
    }
      else if (response.toString().includes("Police")){
      a.download = 'transcript_and_response_police.txt';
    }
      else if (response.toString().includes("Fire")){
      a.download = 'transcript_and_response_fire.txt';
    }
     else if (response.toString().includes("EMS")){
      a.download = 'transcript_and_response_EMS.txt';
    }
     else {
      a.download = 'transcript_and_response.txt';
    }
    

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>SynerGuard</title>
        <meta name="description" content="" />
      </Head>
      <body>
      <Navbar />
      <main className="flex w-full flex-col" style={{ backgroundColor: "rgb(238, 240, 241)", minHeight: `calc(100vh - ${navbarHeight})`, padding: "24px", overflow: "hidden" }}>
        <div className="flex w-full flex-1 justify-center gap-x-4">
          <div className="bg-white rounded-lg p-4 w-1/2 flex-1 border border-gray-300">
            <div className="left-block" id="container">
            <div className="button-container">
              <div className="sbtn flex justify-center items-center">
                <button className="btn circular-button bg-slate-500" id="startButton" ref={startButtonRef} onClick={handleStartButtonClick}>Start Voice Input</button>
              </div>
              <div className="button-row flex justify-center">
                <button className="csbtn rounded-outline-button" id="clearStorageButton" ref={clearStorageButtonRef} onClick={handleClearStorageButtonClick}>Clear Transcript</button>
                <button className="etbtn rounded-outline-button" id="exportTranscriptButton" ref={transcriptRef} onClick={handleExportTranscriptButtonClick}>Export Transcript</button>
                {/* The checkbox styled as a toggle */}
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={medicalRecommendationToggle} 
                    onChange={handleToggleMedicalRecommendationButtonClick}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="toggletext">
                  {medicalRecommendationToggle ? 'Disable Medical Recommendations' : 'Enable Medical Recommendations'}
                </span>

              </div>
            </div>
            </div>

            </div>
          <div className="bg-white rounded-lg p-4 w-1/2 flex flex-col border border-gray-300" style={{ minHeight: `calc(100vh - ${navbarHeight} - 48px)` }}>
            <div className="bg-white rounded-lg p-4 border border-gray-300 mb-4 h-1/2" style={{ overflowY: 'scroll' }}>
              <div className="transcription">
                <p>Transcription:</p>

                <p id="transcript">{transcript.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index !== transcript.split('\n').length - 1 && <br />} {/* Render <br> except after the last line */}
                  </span>
                ))}</p>


              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-300 h-1/2" style={{ overflowY: 'scroll' }}>
              <div className="output" id="output"><p>Output:</p>
                <p id="response">{response.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index !== response.split('\n').length - 1 && <br />}
                    </span>
                ))}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      </body>
      <style jsx>{`
        body{
        overflow: hidden;
        }
        .button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px; /* Adjust spacing between the button groups */
        }

        .sbtn {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column; /* Added for better vertical alignment */
          margin-bottom: 20px; /* Adjust spacing between the circular button and smaller buttons */
        }
        
        .circular-button {
          width: 50vh;
          height: 50vh;
          background-color: #4CAF50;
          color: white;
          border: 4px solid #ccc;
          border-radius: 50%;
          font-size:calc(8px + 2.5vh);
          cursor: pointer;
          text-align: center;
          line-height: 100px; /* This aligns the text vertically */
        }

        .circular-button:hover {
          border-color: #6c6ce5;
        }

        .rounded-outline-button {
          border-radius: 8px;
          border: 2px solid #ccc;
          padding: 8px 16px;
          margin: 4px;
          cursor: pointer;
          outline: none;
        }
        .rounded-outline-button:hover {
          border-color: #6c6ce5;
        }
        .rounded-outline-button:focus {
          border-color: #0056b3;
        }
          .etbtn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    cursor: pointer;
    border-radius: 8px;
    border: 2px solid #ccc;
    background-color: white;
    font-size: 14px;
    gap: 8px; /* Space between the icon and text */
    transition: all 0.3s ease;
  }
  
  .etbtn:hover {
    border-color: #6c6ce5;
    background-color: #f0f0f0;
  }

  .etbtn i {
    font-size: 18px;
  }

  .rounded-outline-button {
    border-radius: 8px;
    border: 2px solid #ccc;
    padding: 8px 16px;
    margin: 4px;
    cursor: pointer;
    outline: none;
  }

  .rounded-outline-button:hover {
    border-color: #6c6ce5;
  }
  .rounded-outline-button:focus {
    border-color: #0056b3;
  }
    .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 35px;
          top:20px;
          left:20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }
.toggletext{
padding-left:30px;
padding-top:10px;}
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          border-radius: 50%;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #4CAF50;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .rounded-outline-button {
          border-radius: 8px;
          border: 2px solid #ccc;
          padding: 8px 16px;
          margin: 4px;
          cursor: pointer;
          outline: none;
        }

        .rounded-outline-button:hover {
          border-color: #6c6ce5;
        }

        .rounded-outline-button:focus {
          border-color: #0056b3;
        }
      `}</style>
    </>
  );
}

export default Page;
