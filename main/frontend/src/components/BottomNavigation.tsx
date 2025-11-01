// Component: Bottom Navigation
// Purpose: Main navigation component for the app
import React from "react";
import Navbar from "./Nav/Navbar";

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function BottomNavigation(props: BottomNavigationProps) {
  // TODO: implement bottom navigation functionality
  return (
      <Navbar></Navbar>
  );
}
