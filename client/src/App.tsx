import{BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './App.css';
import { Navbar } from "./components/navbar";
import { ShopPage } from "./pages/shop";
import { CheckoutPage } from "./pages/checkout";
import { AuthPage } from "./pages/auth";
import { PurchasedItemPage } from "./pages/purchased-items";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<ShopPage/>}/>
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/purchased-items" element={<PurchasedItemPage/>}/>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
