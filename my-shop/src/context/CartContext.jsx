import { createContext, useContext, useEffect, useState } from "react";
const CartContext = createContext();
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")||"[]"));
  useEffect(()=>localStorage.setItem("cart", JSON.stringify(cart)),[cart]);

  const addToCart = (product, qty=1) => {
    setCart(prev=>{
      const i = prev.findIndex(it=>it.product._id===product._id);
      if(i!==-1){ const copy=[...prev]; copy[i]={...copy[i], quantity: copy[i].quantity+qty}; return copy; }
      return [...prev, { product, quantity: qty }];
    });
  };
  const updateQty = (id, q)=> setCart(p=>p.map(it=>it.product._id===id?{...it,quantity:Math.max(1,q)}:it));
  const removeFromCart = (id)=> setCart(p=>p.filter(it=>it.product._id!==id));
  const clearCart = ()=> setCart([]);
  const totalItems = cart.reduce((s,it)=>s+it.quantity,0);
  const totalPrice = cart.reduce((s,it)=>s+it.quantity*(it.product.price||0),0);

  return <CartContext.Provider value={{cart,addToCart,updateQty,removeFromCart,clearCart,totalItems,totalPrice}}>
    {children}
  </CartContext.Provider>;
}
export const useCart = ()=> useContext(CartContext);
