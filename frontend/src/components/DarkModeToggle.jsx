import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function DarkModeToggle(){
  const {dark,setDark}=useContext(ThemeContext);
  return(
    <button onClick={()=>setDark(!dark)}>
      {dark?"☀️":"🌙"}
    </button>
  );
}