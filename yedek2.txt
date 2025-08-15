:root {
    --primary-color: #6e48aa;
    --secondary-color: #9d50bb;
    --accent-color: #4776E6;
}

* {
    touch-action: manipulation;
}

body {
    margin: 0;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
    background: #000;
    color: white;
    -webkit-user-select: none;
    user-select: none;
}

.hidden {
    display: none !important;
}

#game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

#welcome-screen {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: pointer;
}

#header {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    padding: 10px;
    z-index: 100;
    background: rgba(0,0,0,0.7);
}

#score-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 5px;
    flex-wrap: wrap;
}

#score {
    font-size: 1.8rem;
    font-weight: bold;
    color: #FFD700;
}

#stats {
    display: flex;
    gap: 10px;
    font-size: 0.9rem;
    flex-wrap: wrap;
    justify-content: center;
}

#click-area {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

/* Mobil için özel ayarlar */
@media (max-width: 768px) {
    #header h1 {
        font-size: 1.5rem;
    }
    
    #score {
        font-size: 1.5rem;
    }
    
    #stats {
        font-size: 0.8rem;
        gap: 8px;
    }
    
    .glow-button {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
    
    #shop {
        width: 90%;
        padding: 15px;
    }
}