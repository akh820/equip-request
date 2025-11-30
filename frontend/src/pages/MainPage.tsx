import { NavLink } from "react-router";

export default function MainPage() {
  return (
    <div className=" text-3xl">
      <div className="flex">
        <NavLink to="about">About</NavLink>
      </div>
      <div>MainPage</div>
    </div>
  );
}
