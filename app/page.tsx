import Card from "@/app/components/Card";
import Filter from "@/app/components/Filter";

export default function Home() {
  return (
    <section className="mt-24 flex justify-center justify-between gap-x-12">
      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-secondary">Пошук</span>
          </label>
          <input
            type="text"
            placeholder="Ввведіть назву аніме"
            className="input-bordered input input-lg w-full max-w-full bg-dark-grey	"
          />
        </div>
        <section className="gridcols-2 mt-11 grid place-content-center gap-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
          {Array.from({ length: 14 }, () => (
            <Card key={0} />
          ))}
        </section>
      </div>
      <div className="mr-6 md:w-80">
        <Filter />
      </div>
    </section>
  );
}
