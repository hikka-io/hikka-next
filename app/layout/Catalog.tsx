"use client";

import Search from "@/app/components/Search";
import Card from "@/app/components/Card";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import getAnimeCatalog from "@/utils/api/getAnimeCatalog";
import useDebounce from "@/utils/hooks/useDebounce";

const Component = () => {
  const searchParams = useSearchParams();
  const search = useDebounce({
    value:
      searchParams.has("search") && searchParams.get("search")!.length > 3
        ? searchParams.get("search")
        : null,
    delay: 300,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["list", search],
    queryFn: () => getAnimeCatalog({ query: search }),
  });

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
