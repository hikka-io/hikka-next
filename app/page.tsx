import Filter from "@/app/components/Filter";
import Catalog from "@/app/layout/Catalog";

const Home = () => {
  return (
    <section className="mt-24 flex flex-col items-center justify-center md:flex-auto md:flex-row md:items-baseline md:justify-between md:gap-x-12">
      <div className="md:min-w-fit">
        <Catalog />
      </div>
      <div className="order-1 mr-0 md:order-2 md:mr-6 md:w-80">
        <Filter />
      </div>
    </section>
  );
};

export default Home;
