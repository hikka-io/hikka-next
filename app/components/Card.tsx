import Image from "next/image";

interface Props {
  title_en: string;
  poster?: string;
}

const Component = ({ poster, title_en }: Props) => {
  return (
    <article className="w-45 card bg-inherit">
      {/*todo check if undefined*/}
      <figure className="		 rounded-lg	">
        <Image src={poster!} width={184} height={259} alt="Poster" />
      </figure>
      <div className="py-3 pr-3">
        <h2 className="text-white">{title_en}</h2>
      </div>
    </article>
  );
};

export default Component;
