"use client";

import Search from "@/app/components/Search";
import Card from "@/app/components/Card";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import getAnimeCatalog from "@/utils/api/getAnimeCatalog";
// import useDebounce from "@/utils/hooks/useDebounce";
import { useEffect, useState } from "react";

const Component = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [filterSearch, setFilterSearch] = useState(search);

  useEffect(() => {
    if (filterSearch == null || filterSearch.length <= 3) {
      return setFilterSearch(null);
    }
    return setFilterSearch(search);
  }, [search, filterSearch]);

  // console.log(filterSearch.length);

  const { data, isLoading, error } = useQuery({
    queryKey: ["list", filterSearch],
    queryFn: () => getAnimeCatalog({ query: filterSearch }),
  });

  // useDebounce({ value: checkSearch(), delay: 300 })
  // onCompleted: checkSearch

  return (
    <>
      <Search />
      <section className="gridcols-2 mt-11 grid place-content-center gap-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {!isLoading &&
          data &&
          data.list &&
          data!.list.map((x: any) => {
            return (
              <Card poster={x.poster} title_en={x.title_en} key={x.slug} />
            );
          })}
        {error && <div>error</div>}
      </section>
    </>
  );
};

export default Component;
