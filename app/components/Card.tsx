import Image from "next/image";

const Component = () => {
  return (
    <div className="card w-45 bg-base-100">
      <figure>
        <Image src="/card.png" width={184} height={259} alt="Anime Title" />
      </figure>
      <div className="py-3 pr-3">
        <h2 className="">Chainsaw Man</h2>
      </div>
    </div>
  );
};

export default Component;
