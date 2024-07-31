import React from 'react';
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./components/layout/main.layout";
import AppRouter from "./router/AppRouter";
import AvailableGames from './components/lobby';

// Combine both App component functionalities into one
const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MCQ Battle Lobby</h1>
      </header>
      <MainLayout>
        <AppRouter />
        <main>
          <AvailableGames />
        </main>
      </MainLayout>
    </div>
  );
};

export default App;
