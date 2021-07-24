
import React from 'react';
import Header from './Header';  // Add Header.js to App.js
import Footer from './Footer';
import Main from './Main';
function App() {
  return (
      <div className="App">
        <Header />
          <Main />
        <Footer />
      </div>
  );
}

export default App;

//application 的root