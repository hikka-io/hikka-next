"use client";

import Card from "@/app/components/Card";
import Filter from "@/app/components/Filter";
import Autocomplete from "@/app/components/Search";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const getList = async ({ query }: { query?: string | null }) => {
  const res = await fetch("https://testapi.hikka.io/anime/", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
};

const Home = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const { data, isLoading, error } = useQuery({
    queryKey: ["list", search],
    queryFn: () => getList({ query: search }),
  });

  return (
    <section className="mt-24 flex flex-col items-center justify-center md:flex-auto md:flex-row md:items-baseline md:justify-between md:gap-x-12">
      <div className="order-2 md:order-1">
        <Autocomplete />
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
      </div>
      <div className="order-1 mr-0 md:order-2 md:mr-6 md:w-80">
        <Filter />
      </div>
    </section>
  );
};

export default Home;
