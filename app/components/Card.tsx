import Image from "next/image";

const Component = () => {
  return (
    <article className="w-45 card bg-inherit">
      <figure>
        <Image src="/card.png" width={184} height={259} alt="Anime Title" />
      </figure>
      <div className="py-3 pr-3">
        <h2 className="text-white">Chainsaw Man</h2>
      </div>
    </article>
  );
};

export default Component;
