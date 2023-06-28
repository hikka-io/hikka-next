import Link from "next/link";
import Image from "next/image";

const Component = () => {
  return (
    <nav className="navbar bg-base-100 px-10 md:px-0">
      <div className="navbar-start">
        <Link href="#">
          <Image src="/logo.svg" alt="Hikka" width={115} height={34} />
        </Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <a href="#" role="button" className="btn-outline btn-md btn mx-4 px-5">
          Манга
        </a>
        <a href="#" role="button" className="btn-ghost btn-md btn mx-4 px-5 ">
          Аніме
        </a>
        <a href="#" role="button" className="btn-ghost btn-md btn  mx-4 px-5 ">
          Ранобе
        </a>
      </div>
      <div className="navbar-end">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10">
              <Image src="/pfp-temp.png" alt="pfp" width={44} height={43} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-sm mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Component;
