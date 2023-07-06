import Card from "@/app/components/Card";
import Filter from "@/app/components/Filter";

export default function Home() {
  return (
    <section className="mt-24 flex flex-col items-center justify-center md:flex-auto md:flex-row md:items-baseline md:justify-between md:gap-x-12">
      <div className="order-2 md:order-1">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-secondary">Пошук</span>
          </label>
          <input
            type="text"
            placeholder="Ввведіть назву аніме"
            className="input-bordered input input-lg w-fit max-w-full bg-dark-grey md:w-full"
          />
        </div>
        <section className="gridcols-2 mt-11 grid place-content-center gap-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
          {Array.from({ length: 14 }, () => (
            <Card key={0} />
          ))}
        </section>
      </div>
      <div className="order-1 mr-6 md:order-2 md:w-80">
        <Filter />
      </div>
    </section>
  );
}
