import Image from "next/image";
import {IoSearch} from "react-icons/io5";

export default function Home() {
  return (
      <div className="container mx-auto mt-10">
          <div className="navbar bg-base-100">
              <div className="flex-1">
                  <Image src="/logo.svg" alt="Hikka" width={115} height={34} />
              </div>
              <div className="flex-none">
                  <div>
                      <IoSearch />
                  </div>
                  <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                          <div className="w-10">
                              <Image src="/pfp-temp.png" alt="pfp" width={44} height={43} />
                          </div>
                      </label>
                      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                          <li>
                              <a className="justify-between">
                                  Profile
                                  <span className="badge">New</span>
                              </a>
                          </li>
                          <li><a>Settings</a></li>
                          <li><a>Logout</a></li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>

  )
}
