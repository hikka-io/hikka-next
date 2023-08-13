import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
// import getAnimeCatalog from "@/utils/api/getAnimeCatalog";

const Component = () => {
  const [search, setSearch] = useState("");

  // todo useSearchParams

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.push(`${pathname}?search=${search}`);
  }, [search]);

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-secondary">Пошук</span>
      </label>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        type="text"
        placeholder="Ввведіть назву аніме"
        className="input-bordered input input-lg w-fit max-w-full bg-dark-grey md:w-full"
      />
    </div>
  );
};

export default Component;
