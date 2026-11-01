"use client";
import { useEffect } from "react";
import { fitGrid } from "./grid";

// Keeps the character grid in sync after client-side navigation and on resize.
export default function GridSizer() {
  useEffect(() => {
    fitGrid();
    window.addEventListener("resize", fitGrid);
    return () => window.removeEventListener("resize", fitGrid);
  }, []);
  return null;
}
