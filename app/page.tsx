import NavBar from "@/app/components/NavBar";
import Card from "@/app/components/Card";

export default function Home() {
  return (
    <div className="container mx-auto mt-10">
      <NavBar />
      <section className="mt-24 flex max-w-none justify-center md:max-w-4xl">
        {/*<section className="grid grid-cols-[max-content_1fr]">*/}
        <div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Пошук</span>
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
        {/*<div>*/}
        {/*  <GenreSelect />*/}
        {/*</div>*/}
      </section>
    </div>
  );
}
