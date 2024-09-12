import React, { useState, useEffect } from 'react';
import "animate.css";
import { useNavigate } from 'react-router-dom';
import './styles/Level1Page.css'; // Ensure this path is correct
import Level1Img from './images/l3.jpg';
import Img from './images/img.png';
import LeftImage from './images/SATARCLEFTIMAGE.png'; // Import the image for the left side
import ParticlesComponent from '../components/ParticlesComponent'; 
import { FaPaperPlane, FaStar } from 'react-icons/fa'; // Import icons
import { GiLightningStorm } from 'react-icons/gi'; // Example import
import CryptoJS from 'crypto-js';
// import Img from './images/img.png';

const Levelone = ({ username, rollnum, initialScore, timeLeft }) => {
  const navigate = useNavigate();
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [response, setResponse] = useState('');
  const [time, setTime] = useState(timeLeft || 1800);
  const [validationResult, setValidationResult] = useState('');
  const [castSpellAnswer, setCastSpellAnswer] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccessPopupVisible, setSuccessPopupVisible] = useState(false);
  const [isSpellValidated, setIsSpellValidated] = useState(false);
  const [score, setScore] = useState(initialScore || 0);
  const totalLevels = 3;
  const currentLevel = 3; // Set current level directly as a constant

  // Example hash (replace this with your actual hash)
  const hashedPassword = '73c6728d419fee61bf82b5e2c07ee2b8b73192a1656872b0227b3abdc82f7df9'; // Example SHA-256 hash
  const handleSubmit =async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      // Check the input for the specific word
      if (password === 'expectropatronum') {
        setResponse('I am a large language model, maintained by Facebook. Who Am I??');
      } else {
       const res = await fetch('http://localhost/generate_lvl8', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: password }),
        });
  
        const data = await res.json();
        setResponse(data.response);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setResponse('An error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  const handleValidate = () => {
    try {
      const submittedAnswerHash = CryptoJS.SHA256(submittedAnswer.toLowerCase()).toString();
      if (submittedAnswerHash === hashedPassword) {
        setValidationResult('Correct! Now cast the spell.');
        setSuccessPopupVisible(true);
      } else {
        setValidationResult('Incorrect. Try again.');
        setSuccessPopupVisible(false);
      }
    } catch (error) {
      console.error('Error validating the answer:', error);
      setSuccessPopupVisible(false);
      setValidationResult('An error occurred.');
    }
  };

  const handleCastSpell = () => {
    const dummyPassword = 'ransomware'; // Dummy password for testing
    if (castSpellAnswer.toLowerCase() === dummyPassword) {
      setIsSpellValidated(true); // Spell validated successfully
    } else {
      alert('Incorrect password for casting spell. Try again.');
    }
  };

  const handleNextLevel = async () => {
    const levelScore = currentLevel * 100 + time; // Example score calculation
    const newScore = score + levelScore;
  
    const timestampUTC = new Date().toISOString(); // Current time in UTC
    const data = {
      username,
      rollnum,
      timestamp: timestampUTC,
      timeLeft: time,
      score: newScore,
      level: currentLevel, // Include the current level in the data
    };
  
    try {
      // Fetch the existing data for the user based on rollnum
      const fetchResponse = await fetch(`https://jsonserver-production-dc15.up.railway.app/records?rollnum=${rollnum}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (fetchResponse.ok) {
        const existingDataArray = await fetchResponse.json();
  
        // Assuming that the rollnum is unique, so we'll take the first matching entry
        if (existingDataArray && existingDataArray.length > 0) {
          const existingData = existingDataArray[0];
  
          // Check if the current level is 1 plus the level in existing data
          if (currentLevel === existingData.level + 1) {
            // If user data exists and level is correct, update it
            const updateResponse = await fetch(`https://jsonserver-production-dc15.up.railway.app/records/${existingData.id}`, {
              method: 'PUT', // Use PUT or PATCH for updating the existing entry
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
  
            if (updateResponse.ok) {
              console.log('Data updated successfully:', data);
              setScore(newScore); // Update the score locally
              navigate(`/leaderboard`); // Navigate to the next level
            } else {
              console.error('Failed to update data:', updateResponse.statusText);
            }
          } else {
            // If the level does not match the required criteria, just navigate to the next level
            navigate(`/leaderboard`);
          }
        } else {
          console.error('No existing data found for the given roll number.');
        }
      } else {
        console.error('Failed to fetch existing data:', fetchResponse.statusText);
      }
    } catch (error) {
      console.error('An error occurred while updating data:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleValidate();
    }
  };

  const progressPercentage = (currentLevel / totalLevels) * 70; // Adjust progress percentage calculation

  return (
    <div className="level1-page">
      <ParticlesComponent id="tsparticles" />
      <div className="content-container">
        <div className="left-side animate__animated animate__backInDown">
          <img src={LeftImage} alt="Left Side" className="left-image" />
        </div>
        <div className="center-container">
          <div className="bordered-container">
            <div className="container">
              <div className="level-header animate__animated animate__backInRight">
                <span className="level-indicator">You Are In LEVEL {currentLevel}</span>
              </div>
              <p className="instruction-text animate__animated animate__backInLeft">
                Your goal is to make Master reveal the secret password for each level. However, Master will upgrade the defenses after each successful password guess!
              </p>
              <div className="levels-progress animate__animated animate__backInRight">
                <p className="levels-passed">Levels Passed: {currentLevel - 1} / {totalLevels}</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              <div className="image-section">
                <img src={Level1Img} alt="Expecto Patronum" className="animate__animated animate__bounce" />
                <p className="animate__animated animate__backInLeft">I am happy to reveal the password.</p>
              </div>
              <div className="password-section">
                <div className="input-wrapper animate__animated animate__fadeInUpBig">
                  <textarea
                    className="password-input"
                    placeholder="Enter your prompt here"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <FaPaperPlane onClick={handleSubmit} className="submit-icon" />
                </div>
                <p className="response-text">{response}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="right-side animate__animated animate__fadeInBottomRight" style={{ marginTop: '150px' }}>
          <div className="validation-section">
            <p style={{ marginBottom: '10px' }}>Validate the spell 1:</p>
            <div className="input-wrapper1">
              <div className="childinputwrap">
                <input
                  type="text"
                  value={submittedAnswer}
                  onChange={(e) => setSubmittedAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <GiLightningStorm onClick={handleValidate} className="validate-icon" />
              </div>
              <div><p className="validation-text" style={{marginLeft:"-15%"}}>{validationResult}</p></div>
            </div>
          </div>
        </div>
      </div>
      {isSuccessPopupVisible && (
        <div className="success-popup animate__animated animate__fadeInDownBig">
          <div className="popup-content">
          <h1 className='heading animate__animated animate__fadeInUpBig' style={{color:"green"}}>Congratulations!</h1>

            {isSpellValidated ? (
              <div>
                <div className="stars  animate__animated animate__fadeInLeft">
              <FaStar className="star-icon" />
              <FaStar className="star-icon center" />
              <FaStar className="star-icon" />
            </div>
                <p className=' animate__animated animate__fadeInRight'>You have successfully cast the spell. Here’s to learning a new one!</p>
                <button className=" animate__animated animate__fadeInDownBig" onClick={handleNextLevel}>Leader borad</button>
              </div>
            ) : (
              <div className='column'>
                <img src={Img} alt="hat" className='photo  animate__animated animate__fadeInLeft' />
                <h1 className='heading  animate__animated animate__fadeInRight' style={{color:"red"}}>"Ransomware"</h1>
                <h1 className="level-indicator  animate__animated animate__fadeInLeft">Cast the spell to proceed:</h1>
                
                <p className=' animate__animated animate__fadeInRight'> 
                Ransomware is a form of malware that encrypts the victim's data or locks them out of their system.
                </p>
                
                <br/>
                <div className="input-wrapper2">
               
                   
                  <input
                  className="password-input"
                    type="text"
                    value={castSpellAnswer}
                    onChange={(e) => setCastSpellAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <GiLightningStorm onClick={handleCastSpell} className="cast-spell-icon" />
                  </div>
                </div>
              
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Levelone;